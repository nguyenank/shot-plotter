# Changelog

All notable changes to this project will be documented in this file.

**Note:** this log was populated retroactively for versions 2.1.0 and before; the notes for those versions may be missing details, especially for any bug fixes.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to the spirit of [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as best it can without a proper API.

## [2.3.0] - 2024-12-26

#### New Playing Areas

-   Football Net (IFAB)
-   Soccer Net (NCAA)
-   Indoor Lacrosse (NLL customizable in feet)

### Fixed

-   Bandage fix for ghost dots not appearing promptly by disabling the size appearance transition for ghost dots.
-   Fix sizing for default Soccer (NCAA) playing area.
-   Fix dot transformation when changing dimensions on customizable dimension playing areas.

### Changed

-   Adjusted Ice Hockey (IIHF) playing area to allow customization of width and corner radius.

## [2.2.0] - 2024-06-26

### Added

-   Ability to choose custom height and width for soccer/football playing areas on the sport selection page and have the resulting playing area match the specified values.
-   Changelog.

#### New Playing Areas

-   Fistball (IFF) thanks to [@billyfryer](https://github.com/billyfryer)
-   Football (IFAB customizable in meters)
-   Soccer (IFAB customizable in yards)

### Changed

-   Adjusted Soccer (NCAA) playing area to also allow customization of field height and width.

## [2.1.0] - 2023-09-30

### Added

-   Ability to mark textbox details as editable and edit their values in the data table.
-   Sport-specific feature to NFL football that adds a toggle above the field to indicate the direction of the offense and columns for the coordinates (XAdj and YAdj) that do the calculations such that the offense is always travelling to the right.

#### New Playing Areas

-   Tennis (ITF)

## [2.0.1] - 2023-09-24

### Fixed

-   Properly save dropdown options as found by [@PaShTiDa](https://github.com/PaShTiDa).
-   Remove added shot types on reset.

## [2.0.0] - 2023-02-11

### Changed

-   Underlying data storage mechanism changed from session storage to data storage, so setups and shots for a particular playing area persist across refreshes.

## [1.9.0] - 2023-01-28

### Added

#### New Playing Areas

-   Korfball (IKF) thanks to [@davescroggs](https://github.com/davescroggs)
-   Netball (SSN) thanks to [@davescroggs](https://github.com/davescroggs)
-   Field Hockey (IHF)
-   Canadian Football (CFL)
-   Canadian Football (CFL pre-2022 & Amateur)
-   Hurling and Gaelic Football (GAA)

### Fixed

-   README typos and legacy wording of rink versus playing area thanks to [@davescroggs](https://github.com/davescroggs).

## [1.8.0] - 2023-01-08

### Added

#### New Playing Areas

-   Ice Hockey Net (NHL)
-   Australian Rules Football (AFL)
-   Rugby Union (World Rugby)
-   Table Tennis (ITTF)

### Changed

-   Add 'Fouled' as default option for Outcome for basketball.

### Fixed

-   Bug regarding custom setup and preserving details on importing.
-   Bug with firstPoint not being initialized.

## [1.7.0] - 2022-09-13

### Added

#### New Playing Areas

-   Soccer (NCAA)

## [1.6.0] - 2022-04-02

### Added

-   Ability to filter rows based on their column value.
-   Analytics tracking via Plausible.

### Changed

-   Table download only includes filtered rows if any row filters are active.

## [1.5.1] - 2022-02-17

### Changed

-   Adjust scaling for heat map to have tighter heat maps across all sports.
-   Update IIHF rink svg for pushed out blue lines.

## [1.5.0] - 2022-01-14

### Added

#### New Playing Areas

-   Volleyball (NCAA)
-   Men's Lacrosse (NCAA)
-   Women's Lacrosse (NCAA)

## [1.4.0] - 2022-01-07

### Added

-   Heat map view option, which adds a toggle for a 2D density plot overlaid on the playing area.

## [1.3.0] - 2021-12-05

### Added

#### New Playing Areas

-   Handball (IHF)

### Changes

-   Modify preprocessing to inject playing area SVGs on build instead of server-side.

## [1.2.0] - 2021-12-03

### Added

-   Option for adding calculated column "distance", which automatically calculates and has the value of the distance between two points for a row with two coordinates, or the distance between the point and the nearest goal (if applicable) for a row with one coordinate.
-   Option for adding calculated column "shot value", specifically for basketball, which automatically calculates and has the value of whether a shot from the location indicated by a row with one coordinate would be worth 2 or 3 points.

#### New Playing Areas

-   American football (NCAA)
-   American football (NFL)

## [1.1.0] - 2021-11-13

### Added

#### New Playing Areas

-   ice hockey (IIHF)

### Changed

-   Update NHL rink to make neutral zone faceoff dots red, and all faceoff dots only partially filled.

## [1.0.0] - 2021-11-12

### Added

-   Support for shot-plotter infrastructure for other sports.

#### New Playing Areas

-   floorball (IFF)
-   basketball (NBA)
-   basketball (NCAA)
-   basketball (WNBA)

### Changed

-   Home page points to sport selection page rather the ice hockey page.

## [0.8.0] - 2021-10-17

### Added

-   Animations for creating a new dot and row, selecting a dot, and deleting a dot.

## [0.7.0] - 2021-09-28

### Added

-   Ability to change number of detail widgets per row of the details panel.

### Changed

-   Update customize model explanation.

### Fixed

-   Bug with overlapping detail names.

## [0.6.1] - 2021-09-09

### Changed

-   Grey out "customize setup" button when there are rows in the table to indicate it cannot be done.

## [0.6.0] - 2021-08-28

### Added

-   Ability to change number of rows per page of table.

### Changed

-   Paginated table rather than appending rows without limit.
-   Change "customize" wording to "setup".
-   Put customize modal explanation behind accordion-style tab.

## [0.5.0] - 2021-07-03

### Added

-   Ability to have two coordinates associated with a single row.
-   Ability to toggle between creating rows with one and two coordinates with a toggle or the "Shift" key.

## [0.4.0] - 2021-06-20

### Added

-   Ability to create custom detail with a time widget that can count up or down in seconds and be edited while paused.

## [0.3.0] - 2021-06-08

### Added

-   Ability to edit custom details.
-   Ability to delete custom and default details.

### Fixed

-   Fix mislabeling of shot # in downloadCSV.

## [0.2.0] - 2021-06-03

### Added

-   Ability to add custom details with corresopnding widgets of type: text field, dropdown, and radio buttons.
-   Ability to hide and reorder details.
-   Ability to download/upload custom details setups.

## [0.1.0] - 2021-04-02

### Added

-   Hockey rink SVG aligning to NHL specifications.
-   Ability to set values for four details, "Period", "Team", "Player", and "Type".
-   Ability to click on rink to create dot and add row to table with the current details.
-   Ability to download and upload table.

[2.3.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v2.3.0
[2.2.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v2.2.0
[2.1.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v2.1.0
[2.0.1]: https://github.com/nguyenank/shot-plotter/releases/tag/v2.0.1
[2.0.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v2.0.0
[1.9.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.9.0
[1.8.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.8.0
[1.7.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.7.0
[1.6.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.6.0
[1.5.1]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.5.1
[1.5.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.5.0
[1.4.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.4.0
[1.3.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.3.0
[1.2.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.2.0
[1.1.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.1.0
[1.0.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v1.0.0
[0.8.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.8.0
[0.7.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.7.0
[0.6.1]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.6.1
[0.6.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.6.0
[0.5.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.5.0
[0.4.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.4.0
[0.3.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.3.0
[0.2.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.2.0
[0.1.0]: https://github.com/nguyenank/shot-plotter/releases/tag/v0.1.0
