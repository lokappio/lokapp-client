import config from "@/config";
import {AxiosResponse} from "axios";
import Invitation from "../models/api/Invitation";
import {Role} from "../models/roles/role.enum";
import ApiService from "./ApiService";

class InvitationsService {
    static invitationsUrl: string = config.baseUrl + "/invitations";

    public static deleteInvitation(invitationId: number): Promise<any> {
        return ApiService.delAPI(`${InvitationsService.invitationsUrl}/${invitationId}`).catch((error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        throw "errors.unauthorized";
                    default:
                        throw "errors.unknown_error";
                }
            }
        });
    }

    public static createInvitation(projectId: number, email: string, role: Role, sourceLanguagesIds: number[], targetLanguagesIds: number[]): Promise<any> {
        const bodyParameters = {
            "projectId": projectId,
            "email": email,
            "role": role,
            sourceLanguagesIds : sourceLanguagesIds.join(","),
            targetLanguagesIds: targetLanguagesIds.join(","),
        };

        return ApiService.postAPI(`${InvitationsService.invitationsUrl}`, bodyParameters)
          .catch((error) => {
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        throw "errors.unauthorized";
                    case 422:
                        throw "errors.invitation_already_exists";
                    default:
                        throw "errors.unknown_error";
                }
            }
        });
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