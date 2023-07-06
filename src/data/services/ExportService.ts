import { exportProject } from "./export/export_configuration";
import {FileData} from "@/data/models/types/export";

class ExportService {
    public static exportDatas = (platform: string, prefixWithGroup: boolean): FileData[] => exportProject(platform, prefixWithGroup);
}

export default ExportService;