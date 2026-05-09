# Grocery Inventory Management

A web application for managing grocery store inventory — track products, organize categories, monitor stock levels, and get alerts for expiring items.

## Features

- **Product Management** — Add, edit, delete, and search grocery items
- **Category Management** — Organize products into categories with descriptions
- **Stock Monitoring** — Instant visibility into out-of-stock and low-stock items (below 5 units)
- **Expiry Alerts** — Flags items expiring within the next 7 days
- **Search** — Case-insensitive product search by name
- **Category Join View** — View products alongside their full category details

## Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Templating | EJS                        |
| Server     | Express                    |
| Validation | express-validator          |
| Database   | PostgreSQL (via `pg` pool) |

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd grocery-inventory
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your PostgreSQL database and create the required tables (see [Database Schema](#database-schema)).

4. Configure your database connection in `pool.js` (or via environment variables).

5. Start the server:
   ```bash
   node app.js
   ```
