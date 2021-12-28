import { exportProject, EXPORT_CONFIGURATION } from "./export/export_configuration";

class ExportService {
    public static exportDatas = (platform: string) => {
        switch (platform) {
            case EXPORT_CONFIGURATION.PLATFORMS.ANDROID: 
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.ANDROID);
            case EXPORT_CONFIGURATION.PLATFORMS.IOS: 
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.IOS);
            case EXPORT_CONFIGURATION.PLATFORMS.WEB:
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.WEB);
            default:
                break;
        }
    }
}

export default ExportService;