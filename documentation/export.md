# Export

The main purpose of this web application is to manage your list of translations for your mobile or web projects.

This list of translations can then be exported in several formats, letting you focus only on importing the right files.

The whole exportation process is done on this web application rather than on the API.

## Supported exports

Currently, there are 3 supported platforms: 
* Web (`.json`files)
* Android (`.xml` files)
* iOS (`.strings` files + `.stringdict` files for plural)

## Supporting a new format

The whole export management is done in `/src/data/services/export`.

To add a new platform:
- Add the new platform in `EXPORT_CONFIGURATION.PLATEFORMS` (`export_configuration.ts`)
- In the `generateStringFiles` function, add your new platform on the `switch`, then add your function which will be called to create your files
- In `ExportService`, add the new `case` in the `switch` that will called the `exportProject` function with your platform
- Then, in `DownloadProject.vue`, in the `downloadFinished` method, add the name of your custom files.

To make the development of your function creating new export files easier, take a look at `src/data/models/export/`.  
You will find classes used to manage datas, and you will be able to parse the data in an easier way.