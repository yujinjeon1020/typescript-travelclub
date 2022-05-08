import Address from "../../../step1/entity/club/Address";
import ClubMembershipDto from "./ClubMembershipDto";
import CommunityMember from "../../../step1/entity/club/CommunityMember";

class MemberDto {

    email: string = '';
    name: string = '';
    nickName: string = '';
    phoneNumber: string = '';
    birthDay: string = '';

    addresses: Address[] = [];
    membershipList: ClubMembershipDto[] = [];

    constructor(email: string, name: string, phoneNumber: string) {
        this.setEmail(email);
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    //from entity to dto
    static fromEntity(member: CommunityMember): MemberDto {
        //dto 객체 생성
        const memberDto = new MemberDto(member.email, member.name, member.phoneNumber);

        memberDto.nickName = member.nickName;
        memberDto.birthDay = member.birthDay;
        memberDto.addresses = member.addresses;

        return memberDto;
    }

    //이메일 설정
    setEmail(email: string): void  {
        if (!this.isValidEmailAddress(email)) {
            throw new Error('이메일 형식이 잘못되었습니다. ---> ' + email);
        }
        this.email = email;
    }

    //이메일 형식 검사
    isValidEmailAddress(email: string): boolean {
        const ePattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_'{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";

        return !!email.match(ePattern);
    }

    //from dto to entity
    toMember(): CommunityMember {
        //entity 객체 생성
        const member = new CommunityMember(this.email, this.name, this.phoneNumber);

        member.nickName = this.nickName;
        member.birthDay = this.birthDay;

        //멤버십
        for (const membershipDto of this.membershipList) {
            member.membershipList.push(membershipDto.toMembership());           //ENTITY로 PUSH
        }
        return member;
    }
}

export default MemberDto;