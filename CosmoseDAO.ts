import {CosmosClient, ItemResponse}  from "@azure\\cosmos";
import {GetPrimaryConnectionKey, GetDataBaseName, GetProfileContainerName, GetRequestContainerName} from "./DateBaseStringValues";
import {Profile,  Request} from '../Shared/Entity';
import ProfileManager from '../Shared/ProfileManager';
import RequestManager from '../Shared/RequestManager';

const CosmoseClient:CosmosClient = new CosmosClient(GetPrimaryConnectionKey())
const database = CosmoseClient.database( GetDataBaseName() ); // Name of th DataBase
const ProfileContainer = database.container( GetProfileContainerName() ); // Container name
const RequestContainer = database.container( GetRequestContainerName() ); // Container name

/**Interface used to define Database Server interaction functinos*/
export interface CosomseInteractions{
    //Profile Commands=========================================
    /**Used to Initilize a Profile on the Server*/
    CreateProfile(      InputProfile:Profile):Promise<Profile>
    /**Returns a Profile from the Server*/
    GetSingleProfile(   InputProfile:Profile):Promise<Profile>
    /**Get All Profiles from the Server*/
    GetAllProfiles(                        ):Promise<Profile[]>
    /**Update a Profile on the Server*/
    UpdateProfile(      InputProfile:Profile):Promise<Profile>
    /**Delete a Profile on the Server*/
    DeleteProfile(      InputProfile:Profile):Promise<boolean>

    //Request Commands=========================================
    /**Used to Initilze a Request on the Server*/
    CreateRequest(      InputRequest:Request):Promise<Request>
    /**Used Get a single Request from the Server*/
    GetSingleRequest(   InputRequest:Request):Promise<Request>
    /**Get all Request from the Server*/
    GetAllRequest(                          ):Promise<Request[]>
    /**Update a Request on the server*/
    UpdateRequest(      InputRequest:Request):Promise<Request>
    /**Delete a Request on the Server*/
    DeleteRequest(      InputRequest:Request):Promise<boolean>
}


export class CosmoseManager implements CosomseInteractions{
    // Profile Commands===========================================
    async CreateProfile(InputProfile: Profile): Promise<Profile> {
        const Response = await ProfileContainer.items.create<Profile>( InputProfile );
        const ReturnProfile:Profile= {...Response.resource}
        return ReturnProfile;
    }
    async GetSingleProfile(InputProfile: Profile): Promise<Profile> {
        const TempPObj:ProfileManager = new ProfileManager(InputProfile);
        const ID = TempPObj.GetID();
        const Response = await ProfileContainer.item(ID,ID).read<Profile>();
        const ReturnProfile:Profile= {...Response.resource};
        return ReturnProfile;
    }
    async GetAllProfiles(): Promise<Profile[]> {
        const Response = await ProfileContainer.items.readAll<Profile>().fetchAll();
        const ReturnProfileArray:Profile[] = {...Response.resources};
        return ReturnProfileArray;
    }
    async UpdateProfile(InputProfile: Profile): Promise<Profile> {
        const Response = await ProfileContainer.items.upsert<Profile>(InputProfile);
        const ReturnProfile:Profile= {...Response.resource}
        return ReturnProfile;
    }
    async DeleteProfile(InputProfile: Profile): Promise<boolean> {
        const TempPObj:ProfileManager = new ProfileManager(InputProfile);
        const ID = TempPObj.GetID();
        const Response = await ProfileContainer.item(ID,ID).delete<Profile>();
        return (Response !== undefined);
    }

    // Request Commands ===============================================
    async CreateRequest(InputRequest: Request): Promise<Request> {
        const Response = await RequestContainer.items.create<Request>( InputRequest );
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }
    async GetSingleRequest(InputRequest: Request): Promise<Request> {
        const TempRObj:RequestManager = new RequestManager(InputRequest);
        const ID = TempRObj.GetRequestID();
        const Response = await RequestContainer.item(ID,ID).read<Request>();
        const ReturnRequest:Request= {...Response.resource};
        return ReturnRequest;
    }
    async GetAllRequest(): Promise<Request[]> {
        const Response = await RequestContainer.items.readAll<Request>().fetchAll();
        const ReturnProfileArray:Request[] = {...Response.resources};
        return ReturnProfileArray;
    }
    async UpdateRequest(InputRequest: Request): Promise<Request> {
        const Response = await RequestContainer.items.upsert<Request>(InputRequest);
        const ReturnRequest:Request= {...Response.resource}
        return ReturnRequest;
    }
    async DeleteRequest(InputRequest: Request): Promise<boolean> {
        const TempRObj:RequestManager = new RequestManager(InputRequest);
        const ID = TempRObj.GetRequestID();
        const Response = await RequestContainer.item(ID,ID).delete<Request>();
        return (Response !== undefined);
    }
}