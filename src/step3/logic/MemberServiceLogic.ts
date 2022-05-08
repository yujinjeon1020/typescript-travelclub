import MemberService from "../service/MemberService";
import CommunityMember from "../../step1/entity/club/CommunityMember";
import MapStorage from "./storage/MapStorage";
import MemberDto from "../service/dto/MemberDto";

class MemberServiceLogic implements MemberService {

    memberMap: Map<string, CommunityMember>;            //key는 email!

    constructor() {
        this.memberMap = MapStorage.getInstance().memberMap;
    }

    //Create
    register(memberDto: MemberDto): void {
        const memberEmail = memberDto.email;

        const foundMember = this.memberMap.get(memberEmail);

        if (foundMember) {
            throw new Error('Member already exists with the member email: ' + foundMember.email);
        }
        this.memberMap.set(memberEmail, memberDto.toMember())           //to Entity로 저장
    }

    //Select
    find(memberEmail: string): MemberDto {
        const foundMember = this.memberMap.get(memberEmail);

        if (!foundMember) {
            throw new Error('No such member with email --> ' + memberEmail);
        }
        return MemberDto.fromEntity(foundMember);           //from Entity to Dto
    }

    //Select - 이름으로 찾기
    findByName(memberName: string): MemberDto[] {
        const members = Array.from(this.memberMap.values());

        //없으면 빈배열
        if (!members) {
            return [];
        }

        return members.filter(member => member.name === memberName)
                        .map(targetMember => MemberDto.fromEntity(targetMember));       //from entity to dto로 보여주기
    }

    //Update
    modify(memberDto: MemberDto): void {
        const memberEmail = memberDto.email;

        const targetMember = this.memberMap.get(memberEmail);

        if (!targetMember) {
            throw new Error('No such member with email: ' + memberEmail);
        }

        //from entity
        if (!memberDto.name) {
            memberDto.name = targetMember.name;
        }

        if (!memberDto.nickName) {
            memberDto.nickName = targetMember.nickName;
        }

        if (!memberDto.phoneNumber) {
            memberDto.phoneNumber = targetMember.phoneNumber;
        }

        if (!memberDto.birthDay) {
            memberDto.birthDay = targetMember.birthDay;
        }

        this.memberMap.set(memberEmail, memberDto.toMember());          //to entity로 저장
    }

    //Delete
    remove(memberEmail: string): void {
        if (!this.memberMap.get(memberEmail)) {
            throw new Error('No such member with email: ' + memberEmail);
        }
        this.memberMap.delete(memberEmail);
    }
}

export default MemberServiceLogic;