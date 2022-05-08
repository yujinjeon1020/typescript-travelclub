import MemberDto from "./dto/MemberDto";

interface MemberService {

    register(memberDto: MemberDto): void;
    find(memberEmail: string): MemberDto;
    findByName(memberName: string): MemberDto[];                //목록
    modify(memberDto: MemberDto): void;
    remove(memberEmail: string): void;
}

export default MemberService;