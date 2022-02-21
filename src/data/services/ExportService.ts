import { exportProject } from "./export/export_configuration";
import {FileData} from "@/data/models/types/export";

class ExportService {
    public static exportDatas = (platform: string): FileData[] => exportProject(platform);
}

export default ExportService;