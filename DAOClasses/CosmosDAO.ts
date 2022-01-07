import {CosmosClient, ItemResponse}  from "@azure\\cosmos";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "../DateBaseStringValues";
import CosmosInteractions from './DAOInterface';
import {Profile,  Request} from '../Project1-GitUtil-Reimbursement/Types/Entity';
import ProfileManager from '../Project1-GitUtil-Reimbursement/Classes/ProfileManager';
import RequestManager from '../Project1-GitUtil-Reimbursement/Classes/RequestManager';
import ServerLogger from '../Utils/ServerLogger';




export default class CosmosDAOManager implements CosmosInteractions{
    private Logger:ServerLogger = new ServerLogger(0);
    private  CosmosClient:CosmosClient = new CosmosClient(GetPrimaryConnectionKey())
    private database = this.CosmosClient.database( GetDataBaseName() ); // Name of th DataBase
    private ProfileContainer = this.database.container( GetProfileContainerName() ); // Container name
    private RequestContainer = this.database.container( GetRequestContainerName() ); // Container name

    // Profile Commands===========================================
    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        this.Logger.print('Cosmos DAO Creating Profile')
        const Response = await this.ProfileContainer.items.create<Profile>( InputProfile );
        const ReturnProfile:Profile= {...Response.resource}
        this.Logger.print(`Cosmos DAO Profile Created: ${ReturnProfile.FirstName}, ${ReturnProfile.LastName}`)
        return ReturnProfile;
    }
    async GetSingleProfile(ProfileID: string): Promise<Profile> {
        const ID = ProfileID;
        const Response = await this.ProfileContainer.item(ID,ID).read<Profile>();
        const ReturnProfile:Profile= {...Response.resource};
        return ReturnProfile;
    }
    async GetAllProfiles(): Promise<Profile[]> {
        const Response = await this.ProfileContainer.items.readAll<Profile>().fetchAll();
        const ReturnProfileArray:Profile[] = Response.resources;
        return ReturnProfileArray;
    }
    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        const Response = await this.ProfileContainer.items.upsert<Profile>(InputProfile);
        const ReturnProfile:Profile= {...Response.resource}
        return ReturnProfile;
    }
    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        const TempPObj:ProfileManager = new ProfileManager(InputProfile);
        const ID = TempPObj.GetID();
        const Response = await this.ProfileContainer.item(ID,ID).delete<Profile>();
        return (Response !== undefined);
    }

    // Request Commands ===============================================
    async CreateRequest(InputRequest: Request): Promise<Request> {
        const Response = await this.RequestContainer.items.create<Request>( InputRequest );
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }
    async GetSingleRequest(RequestID: string): Promise<Request> {
        const ID = RequestID;
        const Response = await this.RequestContainer.item(ID,ID).read<Request>();
        const ReturnRequest:Request= {...Response.resource};
        return ReturnRequest;
    }
    async GetAllRequest(): Promise<Request[]> {
        const Response = await this.RequestContainer.items.readAll<Request>().fetchAll();
        const ReturnProfileArray:Request[] = {...Response.resources};
        return ReturnProfileArray;
    }
    async UpdateRequest(InputRequest: Request): Promise<Request> {
        const Response = await this.RequestContainer.items.upsert<Request>(InputRequest);
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        const TempRObj:RequestManager = new RequestManager(InputRequest);
        const ID = TempRObj.GetRequestID();
        const Response = await this.RequestContainer.item(ID,ID).delete<Request>();
        return (Response !== undefined);
    }
}