import MemberService from "../service/MemberService";
import MemberStore from "../store/MemberStore";
import ClubMapStoreLycler from "../da.map/ClubMapStoreLycler";
import MemberDto from "../service/dto/MemberDto";

class MemberServiceLogic implements MemberService {

    memberStore: MemberStore;

    constructor() {
        this.memberStore = ClubMapStoreLycler.getInstance().requestMemberStore();
    }

    //회원 등록
    register(memberDto: MemberDto) {
        const email = memberDto.email;
        const foundMember = this.memberStore.retrieve(email);

        if (foundMember) {
            throw new Error('Member already exists with the member email: ' + foundMember.email);
        }
        this.memberStore.create(memberDto.toMember());              //Entity로 저장
    }

    //회원 찾기
    find(memberEmail: string): MemberDto {
        const foundMember = this.memberStore.retrieve(memberEmail);

        if (!foundMember) {
            throw new Error('No such member with email: ' + memberEmail);
        }
        return MemberDto.fromEntity(foundMember);                 //Dto로 보여줌
    }

    //이름으로 회원 찾기
    findByName(memberName: string): MemberDto[] {
        const members = this.memberStore.retrieveByName(memberName);

        if (!members) {
            throw new Error('No such member with name: ' + memberName);
        }
        return members.map(member => MemberDto.fromEntity(member));         //하나씩 하나씩 dto로 변환해서 보여줌
    }

    //회원 수정
    modify(memberDto: MemberDto): void {
        const targetMember = this.memberStore.retrieve(memberDto.email);

        if (!targetMember) {
            throw new Error('No such member with email: ' + memberDto.email);
        }

        //수정 내용을 Dto로
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

        this.memberStore.update(memberDto.toMember());              //ENTITY로 저장
    }

    //회원 삭제
    remove(memberId: string): void {
        if (!this.memberStore.retrieve(memberId)) {
            throw new Error('No such member with email: ' + memberId);
        }
        this.memberStore.delete(memberId);
    }
}

export default MemberServiceLogic;