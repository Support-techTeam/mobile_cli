#import "AppDelegate.h"
#import "RNSplashScreen.h"
#import <Firebase.h>
#import <RNCPushNotificationIOS.h>
#import <React/RCTBundleURLProvider.h>
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <React/RCTLinkingManager.h>
#import <FirebaseAuth/FirebaseAuth.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  // Initialize Firebase
  [FIRApp configure];

  self.moduleName = @"Tradelenda";
  self.initialProps = @{};

  [[FBSDKApplicationDelegate sharedInstance] application:application
                       didFinishLaunchingWithOptions:launchOptions];

  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center =
      [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application performFetchWithCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    // Perform the logout operation for Firebase
    if ([FIRAuth auth].currentUser) {
        NSError *signOutError;
        BOOL success = [[FIRAuth auth] signOut:&signOutError];
        if (!success) {
            NSLog(@"Error signing out: %@", signOutError);
            completionHandler(UIBackgroundFetchResultFailed);
        } else {
            NSLog(@"User signed out successfully");
            completionHandler(UIBackgroundFetchResultNewData);
        }
    } else {
        NSLog(@"No user is currently signed in");
        completionHandler(UIBackgroundFetchResultNoData);
    }
}

////Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}

// // Called when a notification is delivered to a foreground app.
// - (void)userNotificationCenter:(UNUserNotificationCenter *)center
//        willPresentNotification:(UNNotification *)notification
//          withCompletionHandler:
//              (void (^)(UNNotificationPresentationOptions options))
//                  completionHandler {
//   completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge |
//                     UNNotificationPresentationOptionAlert);
// }

// Required for the register event.
- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNCPushNotificationIOS
      didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler
// after handling the remote notification.
- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:
              (void (^)(UIBackgroundFetchResult))completionHandler {
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo
                                fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNCPushNotificationIOS
      didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for local notification tapped event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
    didReceiveNotificationResponse:(UNNotificationResponse *)response
             withCompletionHandler:(void (^)(void))completionHandler {
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

//Facebook SDK integration
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  if ([[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options]) {
    return YES;
  }

  if ([RCTLinkingManager application:app openURL:url options:options]) {
    return YES;
  }

  return NO;
}

@end
