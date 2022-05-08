import MemberStore from "../store/MemberStore";
import CommunityMember from "../../step1/entity/club/CommunityMember";
import MemoryMap from "./io/MemoryMap";

class MemberMapStore implements MemberStore {

    memberMap: Map<string, CommunityMember>;

    constructor() {
        this.memberMap = MemoryMap.getInstance().memberMap;
    }

    //Create
    create(member: CommunityMember): string {
        const targetMember = this.memberMap.get(member.getId());

        if (targetMember) {
            throw new Error('\n> Member already exists with email: ' + member.getId());
        }
        this.memberMap.set(member.getId(), member);                 //CommunityMember 클래스에서 getId해서 나오는 Pk는 email로 지정되어 있음!!

        return member.getId();
    }

    //Select
    retrieve(email: string): CommunityMember | null {
        return this.memberMap.get(email) || null;
    }

    //Select
    retrieveByName(name: string): CommunityMember[] {
        const members = Array.from(this.memberMap.values());

        return members.filter(member => member.name === name);
    }

    //Update
    update(member: CommunityMember): void {
        this.memberMap.set(member.getId(), member);
    }

    //Delete
    delete(memberId: string): void {
        this.memberMap.delete(memberId);
    }

    //exists
    exists(email: string): boolean {
        return this.memberMap.get(email) !== undefined;
    }
}

export default MemberMapStore;
