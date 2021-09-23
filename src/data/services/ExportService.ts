import { exportProject, EXPORT_CONFIGURATION } from "./export/export_configuration";

class ExportService {
    public static exportDatas = (platform: string, headers: any, items: any, groups: any) => {
        switch (platform) {
            case EXPORT_CONFIGURATION.PLATFORMS.ANDROID: 
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.ANDROID, headers, items, groups);
            case EXPORT_CONFIGURATION.PLATFORMS.IOS: 
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.IOS, headers, items, groups);
            case EXPORT_CONFIGURATION.PLATFORMS.WEB:
                return exportProject(EXPORT_CONFIGURATION.PLATFORMS.WEB, headers, items, groups);
            default:
                break;
        }
    }
}

export default ExportService;