/*
  # Fix Analytics Events Staff Access Policy

  ## Changes
  - Update the "Staff can view all analytics events" policy to use the correct metadata path
  - Change from checking `user_metadata` to `app_metadata->>'role'`
  - Ensure staff users can properly query analytics data

  ## Security Notes
  - `app_metadata` is server-controlled and cannot be edited by users
  - Using `role = 'staff'` instead of `is_staff = 'true'` for consistency
  - Wrap auth function with SELECT for better performance
*/

DROP POLICY IF EXISTS "Staff can view all analytics events" ON public.analytics_events;

CREATE POLICY "Staff can view all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');
