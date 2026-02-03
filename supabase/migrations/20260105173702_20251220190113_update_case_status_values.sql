/*
  # Update Case Status Values to New Simplified Stages

  1. Changes
    - Update existing case statuses to match new simplified stages
    - Map old statuses to new statuses:
      - 'Search Underway' -> 'Trademark Search'
      - 'Registration Submitted' -> 'Trademark Registration'
      - 'Processing with USPTO' -> 'Trademark Registration'
      - 'Successfully Registered' -> 'Successfully Registered' (no change)

  2. Notes
    - This is a one-time data migration
    - Preserves the Successfully Registered status
    - Consolidates intermediate stages into single Registration stage
*/

UPDATE client_cases
SET status = 'Trademark Search'
WHERE status = 'Search Underway';

UPDATE client_cases
SET status = 'Trademark Registration'
WHERE status IN ('Registration Submitted', 'Processing with USPTO');