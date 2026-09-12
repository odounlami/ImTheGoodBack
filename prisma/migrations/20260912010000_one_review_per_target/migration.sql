-- A user may review a target profile only once. Existing reviews are edited instead.
CREATE UNIQUE INDEX "reviews_author_id_target_id_key" ON "reviews"("author_id", "target_id");
