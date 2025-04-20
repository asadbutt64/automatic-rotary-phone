import { db } from './server/db';
import { relations } from 'drizzle-orm';
import * as schema from "./shared/schema";

// Push schema to database
async function main() {
  console.log('Pushing schema to database...');
  
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log('✓ Users table created or already exists');

    // Create trading_signals table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS trading_signals (
        id SERIAL PRIMARY KEY,
        coin TEXT NOT NULL,
        symbol TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        signal TEXT NOT NULL,
        entry_price NUMERIC NOT NULL,
        target_price NUMERIC NOT NULL,
        stop_loss NUMERIC NOT NULL,
        confidence NUMERIC NOT NULL,
        risk_reward NUMERIC NOT NULL,
        suggested_leverage NUMERIC NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        active BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);
    console.log('✓ Trading signals table created or already exists');

    // Create technical_indicators table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS technical_indicators (
        id SERIAL PRIMARY KEY,
        coin TEXT NOT NULL,
        name TEXT NOT NULL,
        value TEXT NOT NULL,
        status TEXT NOT NULL,
        info TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ Technical indicators table created or already exists');

    // Create predictions table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        coin TEXT NOT NULL,
        prediction TEXT NOT NULL,
        accuracy NUMERIC NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        result TEXT
      );
    `);
    console.log('✓ Predictions table created or already exists');

    // Create auto_signals table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS auto_signals (
        id SERIAL PRIMARY KEY,
        coin TEXT NOT NULL,
        symbol TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        signal_type TEXT NOT NULL,
        entry_price NUMERIC NOT NULL,
        target_price NUMERIC NOT NULL,
        stop_loss NUMERIC NOT NULL,
        risk_reward NUMERIC NOT NULL,
        leverage NUMERIC NOT NULL,
        indicators TEXT NOT NULL,
        confidence NUMERIC NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        profit_loss NUMERIC,
        trade_type TEXT NOT NULL
      );
    `);
    console.log('✓ Auto signals table created or already exists');

    // Create indexes for better query performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_auto_signals_coin ON auto_signals (coin);
      CREATE INDEX IF NOT EXISTS idx_auto_signals_timeframe ON auto_signals (timeframe);
      CREATE INDEX IF NOT EXISTS idx_auto_signals_status ON auto_signals (status);
      CREATE INDEX IF NOT EXISTS idx_auto_signals_expires_at ON auto_signals (expires_at);
      CREATE INDEX IF NOT EXISTS idx_auto_signals_created_at ON auto_signals (created_at DESC);
    `);
    console.log('✓ Indexes created or already exist');

    console.log('Schema push completed successfully');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });