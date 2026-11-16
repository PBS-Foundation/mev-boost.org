---
sidebar_position: 14
title: API Reference
keywords: [api, builder api, relay api, endpoints, registerValidator, getHeader, getPayload, gloas, epbs, execution payload bid]
---

# API Reference

MEV-Boost implements the [Ethereum Builder API Specification](https://ethereum.github.io/builder-specs). This page provides an overview of the API endpoints and their roles in the block proposal flow.

## Builder API (Consensus Client to MEV-Boost)

These endpoints are called by the consensus client and handled by MEV-Boost before the Gloas fork. From Gloas, the consensus client calls the [Gloas builder API](#gloas-builder-api-epbs) instead. MEV-Boost serves both.

### `POST /eth/v1/builder/validators`

**Register validators** with relays via MEV-Boost.

The consensus client sends a list of validator registrations. MEV-Boost forwards these to all configured relays so they know which validators are using the builder network.

**Request body**: Array of signed validator registrations, each containing:
- `fee_recipient` — Address to receive MEV rewards
- `gas_limit` — Preferred gas limit
- `timestamp` — Registration timestamp
- `pubkey` — Validator public key

```json
[
  {
    "message": {
      "fee_recipient": "0xabcf8e0d4e9587369b2301d0790347320302cc09",
      "gas_limit": "30000000",
      "timestamp": "1234567890",
      "pubkey": "0x93247f2209abcacf57b75a51dafae777f9dd38bc..."
    },
    "signature": "0x1b66ac1fb663c9bc..."
  }
]
```

**Response**: `200 OK` on success.

### `GET /eth/v1/builder/header/{slot}/{parent_hash}/{pubkey}`

**Get the best execution payload header** (bid) for a given slot.

MEV-Boost queries all configured relays (or mux group relays, if applicable) and returns the highest-value valid bid.

**Path parameters**:
- `slot` — The slot number for which to get a header
- `parent_hash` — The parent block hash
- `pubkey` — The proposer's public key

**Response**: The best bid, containing the execution payload header and bid value.

```json
{
  "version": "deneb",
  "data": {
    "message": {
      "header": {
        "parent_hash": "0xcf8e0d4e9587...",
        "fee_recipient": "0xabcf8e0d4e...",
        "block_hash": "0x1234567890ab...",
        "gas_limit": "30000000",
        "gas_used": "15000000",
        "base_fee_per_gas": "1000000000"
      },
      "value": "50956939974241468",
      "pubkey": "0x93247f2209abcacf..."
    },
    "signature": "0x1b66ac1fb663c9bc..."
  }
}
```

### `POST /eth/v1/builder/blinded_blocks`

**Submit a signed blinded block** to retrieve the full execution payload.

After the consensus client signs the winning bid's header, it submits the signed blinded block. MEV-Boost forwards this to the relay that provided the winning bid, which returns the full execution payload.

**Request body**: A signed blinded beacon block containing the execution payload header.

**Response**: The full execution payload, which the consensus client broadcasts to the network.

### `GET /eth/v1/builder/status`

**Check MEV-Boost status**. Returns `200 OK` if the service is running. If `-relay-check` is enabled, it also verifies relay connectivity.

```bash
curl http://localhost:18550/eth/v1/builder/status
```

## Gloas Builder API (ePBS)

From the Gloas fork, the consensus client calls these endpoints instead of `registerValidator`, `getHeader` and `submitBlindedBlock`. All three require the `Eth-Consensus-Version: gloas` header and accept JSON (`application/json`) or SSZ (`application/octet-stream`) bodies up to 10 MiB. See [Gloas (ePBS)](./gloas) for setup, `auth_data` and deadlines.

### `POST /eth/v1/builder/execution_payload_bid/{slot}/{parent_hash}/{parent_root}/{proposer_pubkey}`

**Get one relay's execution payload bid.**

The consensus client sends one request per builder entry. The body is a `SignedBuilderRequestAuth`, signed by the proposer, whose `data` is the `auth_data` of the relay the request is for. MEV-Boost verifies the signature, matches `auth_data` to one relay in the proposer's relay set, and forwards the request unchanged.

**Required headers**: `Date-Milliseconds` and `X-Timeout-Ms`, the consensus client's deadline.

```json
{
  "message": {
    "data": "0x626f6f73742d72656c61792e666c617368626f74732e6e6574",
    "slot": "1234567"
  },
  "signature": "0x1b66ac1fb663c9bc..."
}
```

**Response**: `200` with the relay's signed execution payload bid, or `204` when there is no bid (the relay returned none, failed, or the deadline passed). Invalid requests and an `auth_data` that matches no relay return `400`, and an invalid signature returns `401`.

### `POST /eth/v1/builder/builder_preferences/{proposer_pubkey}`

**Submit proposer preferences** to one relay.

The body holds `preferences` (`max_execution_payment`) and a signed `auth`, routed by `auth_data` like a bid request. Preferences for a slot that has already passed are rejected with `400`.

**Response**: The relay's response, or `500` if the relay fails or doesn't answer.

### `POST /eth/v1/builder/beacon_blocks`

**Submit the signed beacon block** that commits to the winning bid.

MEV-Boost forwards the block to every configured relay, including all mux groups. Only the relay whose bid won accepts it, and its builder then reveals the payload.

**Response**: `202` when one relay accepts the block, `500` if none does. The consensus client gossips the block itself either way.

### Gloas Request Flow

```mermaid
sequenceDiagram
    participant V as Validator Client
    participant CL as Consensus Client
    participant MB as MEV-Boost
    participant R as Relay

    Note over V,R: Setup
    V->>CL: Builder entries (url = MEV-Boost, auth_data = relay)

    Note over V,R: Before the slot
    CL->>MB: POST /eth/v1/builder/builder_preferences/{pubkey}
    MB->>R: POST /eth/v1/builder/builder_preferences/{pubkey}
    R-->>MB: Status
    MB-->>CL: Status

    Note over V,R: Proposal (repeated per builder entry)
    CL->>MB: POST /eth/v1/builder/execution_payload_bid/...
    MB->>R: POST /eth/v1/builder/execution_payload_bid/...
    R-->>MB: Signed execution payload bid
    MB-->>CL: Signed execution payload bid

    CL->>CL: Pick the best bid, sign beacon block
    CL->>MB: POST /eth/v1/builder/beacon_blocks
    MB->>R: POST /eth/v1/builder/beacon_blocks (every relay)
    R-->>MB: 202
    MB-->>CL: 202
    CL->>CL: Broadcast block
```

## Relay Data API

Relays expose a data API for querying delivered payloads, validator registrations, and builder submissions. This is useful for verifying your setup and monitoring relay activity.

### Validator Registration Check

Verify that your validator is registered with a relay:

```
GET /relay/v1/data/validator_registration?pubkey={validator_pubkey}
```

**Example**:

```bash
curl "https://boost-relay.flashbots.net/relay/v1/data/validator_registration?pubkey=0xYOUR_VALIDATOR_PUBKEY"
```

**Response**:

```json
{
  "message": {
    "fee_recipient": "0xabcf8e0d4e9587369b2301d0790347320302cc09",
    "gas_limit": "30000000",
    "timestamp": "1234567890",
    "pubkey": "0x93247f2209abcacf57b75a51dafae777f9dd38bc..."
  },
  "signature": "0x1b66ac1fb663c9bc..."
}
```

### Delivered Payloads

Query recently delivered payloads:

```
GET /relay/v1/data/bidtraces/proposer_payload_delivered
```

Optional query parameters: `slot`, `block_hash`, `block_number`, `proposer_pubkey`, `builder_pubkey`, `limit`, `cursor`.

### Builder Blocks Received

Query blocks submitted by builders:

```
GET /relay/v1/data/bidtraces/builder_blocks_received
```

Optional query parameters: `slot`, `block_hash`, `block_number`, `builder_pubkey`, `limit`.

## Builder API (Builder to Relay)

These endpoints are used by block builders to submit blocks to relays.

### `POST /relay/v1/builder/blocks`

Submit a new block to the relay. The relay validates the block and makes it available for proposers.

### `GET /relay/v1/builder/validators`

Get the list of validators registered with the relay for the current and next epoch. Builders use this to know which slots they can build for.

## Request Flow

```mermaid
sequenceDiagram
    participant V as Validator Client
    participant CL as Consensus Client
    participant MB as MEV-Boost
    participant R as Relay
    participant B as Builder

    Note over V,B: Phase 1: Registration
    V->>CL: Configure fee recipient
    CL->>MB: POST /eth/v1/builder/validators
    MB->>R: POST /eth/v1/builder/validators
    R->>R: Store registrations

    Note over V,B: Phase 2: Building
    B->>R: POST /relay/v1/builder/blocks
    R->>R: Validate & store block

    Note over V,B: Phase 3: Proposal
    CL->>MB: GET /eth/v1/builder/header/{slot}/{parent_hash}/{pubkey}
    MB->>R: GET /eth/v1/builder/header/{slot}/{parent_hash}/{pubkey}
    R-->>MB: Bid (header + value)
    MB-->>CL: Best bid

    CL->>CL: Sign blinded block
    CL->>MB: POST /eth/v1/builder/blinded_blocks
    MB->>R: POST /eth/v1/builder/blinded_blocks
    R-->>MB: Full execution payload
    MB-->>CL: Full execution payload
    CL->>CL: Broadcast block
```

## Specifications

- [Builder API Specification](https://ethereum.github.io/builder-specs) — The full Ethereum Builder API spec.
- [Builder API Specification, Gloas](https://github.com/ethereum/builder-specs/tree/main/specs/gloas) — The Gloas (ePBS) endpoints.
- [Relay API Specification](https://flashbots.github.io/relay-specs/) — Flashbots relay-specific API extensions.
- [Relay Data API](https://flashbots.github.io/relay-specs/) — Data endpoints for querying relay activity.
