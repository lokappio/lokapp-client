import config from "@/config";
import { AxiosResponse } from "axios";
import Invitation from "../models/api/Invitation";
import { Role } from "../models/roles/role.enum";
import ApiService from "./ApiService";

class InvitationsService {
    static invitationsUrl: string = config.baseUrl + "/invitations";

    public static deleteInvitation(projectId: number, invitationId: number): Promise<AxiosResponse> {
        const bodyParameters = {
            "project_id": projectId
        };
        return ApiService.delAPI(`${InvitationsService.invitationsUrl}/${invitationId}`, bodyParameters);
    }

    public static createInvitation(projectId: number, email: string, role: Role): Promise<AxiosResponse> {
        const bodyParameters = {
            "project_id": projectId,
            "email": email,
            "role": role
        };
        return ApiService.postAPI(`${InvitationsService.invitationsUrl}`, bodyParameters);
    }

    public static getInvitations(): Promise<Invitation[]> {
        return ApiService.getAPI(InvitationsService.invitationsUrl)
        .then((response) => {
            return response.data.map((item: any) => {
                return Invitation.map(item);
            })
        })
    }

    public static acceptInvitation(invitation: Invitation): Promise<AxiosResponse> {
        return ApiService.postAPI(`${InvitationsService.invitationsUrl}/${invitation.id}/accept`, {});
    }

    public static declineInvitation(invitation: Invitation): Promise<AxiosResponse> {
        return ApiService.postAPI(`${InvitationsService.invitationsUrl}/${invitation.id}/decline`, {});
    }
}

export default InvitationsService;