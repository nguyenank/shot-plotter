# Shot Plotter

![A screenshot of the web application.](./resources/ice-hockey-screenshot.png)

A [web application](https://shot-plotter.netlify.app/) for plotting events on a sport's playing area with a single click, while keeping track of any other details. The application supports download and upload of .csv files to retrieve that plotted data.

Currently five types of sports/playing areas are supported: ice hockey (NHL), floorball (IFF), and basketball (NBA, NCAA, WNBA).
![A screenshot of the main page of the web application allowing you to pick between sports.](./resources/sport-select-screenshot.png)

The web application is primarily built using D3.js.

### How to Use and Additional Information

From the main page, click on the sport/playing area you want. Each option has information about the specifications that describe that particular playing area, and its dimensions, which correspond to the coordinates.

#### Event Details

By default, four pieces of information can be specified for each event.

The period of the event can be logged through radio buttons.

The team can be specified through radio buttons and a text field that allows custom team names to be entered. The first team, which defaults to Home, corresponds to teal dots, and the second team, which defaults to Away, corresponds to orange dots. The legend below the rink clarifies which color corresponds to which team.

The player can be specified through a text field. If the player entry is 2 characters or less (for a player number, say), the player will appear on the event dot on the playing area.

The type of event can be specified, under Type or Outcome.Additional options can be specified by typing in the dropdown and selecting the new option that appears by clicking or pressing Enter. Each option corresponds to a different dot shape, as indicated by the legend below the rink.

Details logged for each event can be customized by clicking on the _Customize Details_ button at the bottom of the details panel. Details can only be customized when there are noevents recorded.

##### Customizing Setup

Clicking the _Customize Setup_ button will bring up a modal with a list of the current details. Drag-and-drop detail names to reorder them. Click on the eye icon to toggle whether it is visible. Click on the trash can icon to delete details. For created details, click on the pencil-in-a-square icon to edit those details. Reordering details changes their position in both the details panel and the table. The _X_ and _Y_ details cannot be hidden or deleted.

The number of widgets can be changed from its default value of 2 to 1 or 3 by choosing a new value in the dropdown labelled _Widgets per Panel Row_.

The default number of events per table page can be modified by changing the number in the field labelled _Rows Per Table Page_. The default number is 10; the number must be an integer between 1 and 999 (inclusive).

Using the _Enable 2-Location Events_ toggle, the ability to have 2-location events can be enabled. When enabled, _X2_ and _Y2_ details are added to the list of details. Like the _X_ and _Y_ details, the _X2_ and _Y2_ details cannot be hidden or deleted.

Default details can be restored by clicking on the _Reset to Defaults_ button.

Details configurations can be saved or restored through download/upload. When a detail configuration is downloaded, it stores the current order and visibility of details, as well as any newly created details. Also, currently selected/entered options in the details panel are made the default options when the configuration is uploaded; if a detail is not visible, it preserves its original default value.

Clicking on the _Add Details_ Button allows creation of new details. There are four options for types of new details: radio buttons, text field, dropdown, and time widget. The name of all details must be 1-16 characters.

Radio buttons are limited to at most 5 options; each option must be between 1-32 characters and all options must be unique. The default value can be selected by checking the appropriate radio button.

For a text field, a default value can be entered and can be up to 32 characters.

For a dropdown, options are entered in a text area, with each option on a new line. Each option must be between 1-50 characters. The first option is the default selection. Unlike with the _Type_ detail, new options cannot be added from the details panel, though options can still be searched.

A time widget is a timer you can choose to have count up or countdown. The starting time can be inputted when creating the detail; times must be in the format MM:SS or M:SS, where (M)M is minutes and SS is seconds. When using the time widget in the details panel, the time can be edited any time the time widget is paused. The timer can be paused/started by clicking on the button next to the time.

#### Playing Area

To plot events, simply click on the playin area where the event happened. When clicked, a dot will be added of the appropriate color based on team, shape based on type, and text based on player, and a row will be made in the table.

When 2-location events are enabled, 2-location events can be plotted by either holding down the **Shift** button and clicking on two points in the playing area or by switching between 1-location and 2-location mode using the toggle above the playing area.

The playing area matches the specifications from the governing body as specified on the main page. For all playing areas, the center of the playing area has coordinates (0,0), the positive x-axis is to the right, and the positive y-axis is upward.

Credit to [Bill Tran's guide on creating the NHL rink using TidyVerse](https://thewincolumn.ca/2021/01/15/r-tutorial-creating-an-nhl-rink-using-the-tidyverse/) for aid in interpreting the rule descriptions for the ice hockey rink and for the hex codes for the colors.

The playing area size is not pinned to the window size. This allows you to zoom in and place the event exactly where you want it, but does mean the layout can become strange if you change your window size. Refreshing will readjust the size to match the current window size.

#### Table

The table logs the information for each event, as well as the row number of the event in the table. Events can be highlighted by clicking on the check box for the appropriate row. This will highlight the row in the matching team color, and both enlarge the dot on the rink and move it to the front if it was previously covered by other dots. Multiple events can be highlighted at once. Events can be deleted by clicking on the trash can in the appropriate row. All events can be deleted by clicking on the trash can in the header of the table; a prompt will confirm this choice.

The table, by default, shows the last page, which has the last 10 events recorded. Pages can be navigated using the _Prev_(ious) and _Next_ buttons at the lower-right of the table. The currently shown events and the total number of events recorded can be seen in the bottom-left of the table.

#### Download/Upload Table

The event table information can be downloaded by pressing the _Download_ button. There is a text-field to customize the name of the file; otherwise, it defaults to the day and time when the web app was opened. Files are in .csv format, using comma separators, with the header row as it appears on the table, excluding _\#_, included in the file.

To initialize the table, a .csv file can be uploaded using the _Choose File_ button next to the Upload label. Only .csv files are permitted. The header row must exactly match the header row of the table, excluding _\#_, including order. Any custom shot types will be added in shot order. Custom teams will be added in order as they appear, alternating between the teal and orange team. This means if a shot by the orange team is logged first, when the file is downloaded and later uploaded, the team will be blue, but besides color there is no impact to the web app. _When a file is uploaded, any shots previously in the table are erased._

### Running Locally

To run the application locally, any method of running an HTTP server is needed to prevent browser issues with CORS (cross-origin requests - essentially not allowing the JS files to be loaded using the file:// protocol). Some methods include [http-server in Node.js](https://www.npmjs.com/package/http-server), [http.server in Python](https://docs.python.org/3/library/http.server.html), or even some browser-based options like the [Web Server for Chrome extension](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en), but any option will do.

Then, clone this repository; for most methods, it is sufficient to navigate into the repository folder and run the server, but check the exact way of starting a server for the chosen method. No additional packages need to be installed; additional packages are automatically acquired using CDNs.
