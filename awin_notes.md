# Awin account audit

Source: https://ui.awin.com/dashboard/awin/publisher/3064649/us

The logged-in Awin publisher account is BrandJanra, publisher ID 3064649, under the visible user account Nitin Jain. The dashboard shows the profile is incomplete. The account has joined or accepted at least the moonncool and Piscifun advertiser programs. The dashboard exposes Dashboard, Account, Advertisers, Toolbox, Reports, Support, and Activity areas. No Awin API token or advertiser/program ID was exposed in the dashboard overview; those must be obtained from the account/toolbox or supplied by the user without sharing secrets in chat.

Brand Janra repository Awin schema (local source): publisherId, advertiserId, apiToken, deeplinkEndpoint. The existing validation accepts an Awin URL matching awin.com or awin1.com, for example https://www.awin1.com/cread.php.

Live Brand Janra Awin integration status before configuration: repository has backend save/test procedures, but the storefront UI search did not show an Awin section in the current Home.tsx integration panel; the UI currently shows CJ, Rakuten, impact.com, and social connections. Awin UI may need to be added to match CJ.
