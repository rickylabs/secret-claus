-- Migration: Prevent duplicate receiver assignments and add row-level locking
-- Created: 2024-12-25

-- Create unique partial index to prevent duplicate receivers per event
-- Only applies when receiver_id is NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS unique_receiver_per_event
  ON pairing (event_id, receiver_id)
  WHERE receiver_id IS NOT NULL;

--> statement-breakpoint

-- Create function to fetch pairings with row-level locking
-- This prevents race conditions when multiple givers generate assignments simultaneously
CREATE OR REPLACE FUNCTION get_pairings_for_update(
  p_event_id UUID,
  p_exclude_pairing_id UUID
)
RETURNS TABLE (receiver_id UUID)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT p.receiver_id
  FROM pairing p
  WHERE p.event_id = p_event_id
    AND p.id != p_exclude_pairing_id
  FOR UPDATE NOWAIT;  -- Lock rows, fail immediately if locked
EXCEPTION
  WHEN lock_not_available THEN
    -- If rows are locked, raise an error asking user to retry
    RAISE EXCEPTION 'Another participant is currently generating their assignment. Please wait a moment and try again.';
END;
$$;

--> statement-breakpoint

-- Add comment for documentation
COMMENT ON FUNCTION get_pairings_for_update IS 'Fetches pairings for an event with row-level locking to prevent duplicate receiver assignments. Excludes the current pairing being updated.';
