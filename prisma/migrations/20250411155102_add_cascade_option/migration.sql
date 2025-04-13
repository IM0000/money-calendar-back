-- DropForeignKey
ALTER TABLE "EarningsNotification" DROP CONSTRAINT "EarningsNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteDividends" DROP CONSTRAINT "FavoriteDividends_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEarnings" DROP CONSTRAINT "FavoriteEarnings_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteIndicator" DROP CONSTRAINT "FavoriteIndicator_userId_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorNotification" DROP CONSTRAINT "IndicatorNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "OAuthAccount" DROP CONSTRAINT "OAuthAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotificationSettings" DROP CONSTRAINT "UserNotificationSettings_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserNotificationSettings" ADD CONSTRAINT "UserNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthAccount" ADD CONSTRAINT "OAuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteEarnings" ADD CONSTRAINT "FavoriteEarnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDividends" ADD CONSTRAINT "FavoriteDividends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteIndicator" ADD CONSTRAINT "FavoriteIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorNotification" ADD CONSTRAINT "IndicatorNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsNotification" ADD CONSTRAINT "EarningsNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
