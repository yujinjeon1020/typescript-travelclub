import ClubService from "../service/ClubService";
import TravelClub from "../../step1/entity/club/TravelClub";
import CommunityMember from "../../step1/entity/club/CommunityMember";
import MapStorage from "./storage/MapStorage";
import TravelClubDto from "../service/dto/TravelClubDto";
import ClubMembership from "../../step1/entity/club/ClubMembership";
import ClubMembershipDto from "../service/dto/ClubMembershipDto";
import RoleInClub from "../../step1/entity/club/RoleInClub";

class ClubServiceLogic implements ClubService {

    clubMap: Map<string, TravelClub>;
    memberMap: Map<string, CommunityMember>;
    autoIdMap: Map<string, number>;

    constructor() {
        this.clubMap = MapStorage.getInstance().clubMap;
        this.memberMap = MapStorage.getInstance().memberMap;
        this.autoIdMap = MapStorage.getInstance().autoIdMap;
    }

    //Create - 클럽 생성
    register(clubDto: TravelClubDto): void {
        const foundClub = this.retrieveByName(clubDto.name);

        if (foundClub) {
            throw new Error('Club already exists with name: ' + foundClub.name);
        }

        //저장할 Entity 타입
        const club = clubDto.toTravelClub();
        //클럽 이름
        const className = TravelClub.name;

        ///////////////////////////////////////////////////////////////
        //id 설정해주기
        if ('getId' in club || 'setAutoId' in club) {               //클럽 객체 (Entity)에 getId, setAutoId가 존재하면
           if (this.autoIdMap.get(className) === undefined) {       //해당 이름의 클럽이 일련번호가 부여되지 않았다면
               this.autoIdMap.set(className, Number(club.getId()));  //key는 클럽이름, value는 클럽아이디 (숫자로 변환)
           }

           let keySequence = this.autoIdMap.get(className);         //value(클럽 아이디) 가져오기 (number 타입)

            if (keySequence !== undefined) {                        //클럽아이디 번호가 만들어졌으면
                const autoId = keySequence.toString();              //문자열로 변환

                club.setAutoId(autoId);
                this.autoIdMap.set(className, ++keySequence);
            }
        }
        this.clubMap.set(club.getId(), club);       //Entity 타입으로 저장
        clubDto.usid = club.getId();
    }

    //Select - 클럽 찾기
    find(clubId: string): TravelClubDto | null {
        const foundClub = this.clubMap.get(clubId);

        if (!foundClub) {
            throw new Error ('No such club with id --> ' + clubId);
        }
        return TravelClubDto.fromEntity(foundClub);         //Dto로 보여주기
    }

    //Select - 이름으로 클럽 찾기
    findByName(name: string): TravelClubDto {
        const foundClub = this.retrieveByName(name);

        if (!foundClub) {
            throw new Error('No such club with name --> ' + name);
        }
        return TravelClubDto.fromEntity(foundClub);         //Dto로 보여주기
    }

    //Update
    modify(clubDto: TravelClubDto): void {
        const clubId = clubDto.usid;

        const targetClub = this.clubMap.get(clubId);

        if (!targetClub) {
            throw new Error('No such club with id --> ' + clubDto.usid);
        }

        //Entity로 부터
        if (!clubDto.name) {
            clubDto.name = targetClub.name;
        }

        if (!clubDto.intro) {
            clubDto.intro = targetClub.intro;
        }

        this.clubMap.set(clubId, clubDto.toTravelClub());           //to Entity!
    }

    //Delete
    remove(clubId: string): void {
        if (!this.clubMap.get(clubId)) {
            throw new Error('No such club with id -->' + clubId);
        }
        this.clubMap.delete(clubId);
    }

    //Membership 관련
    //네이버 회원을 우리카페로 초대
    addMembership(membershipDto: ClubMembershipDto): void {
        const memberId = membershipDto.memberEmail;

        const foundMember = this.memberMap.get(memberId);

        if (!foundMember) {
            throw new Error('No such member with email --> ' + memberId);
        }

        const clubId = membershipDto.clubId;
        const foundClub = this.clubMap.get(clubId);

        if (!foundClub) {
            throw new Error('No such club with id: ' + clubId);
        }

        const membership = foundClub.membershipList.find(membership => memberId === membership.memberEmail);

        if (membership) {
            throw new Error('Member already exists in the club --> ' + memberId);
        }

        const clubMembership = membershipDto.toMembership();        //Entity로 변한

        foundClub.membershipList.push(clubMembership);      //Entity로 저장! -> foundClub 객체에 (정보 update)
        this.clubMap.set(clubId, foundClub);

        foundMember.membershipList.push(clubMembership);    //Entity로 저장! -> foundMember 객체에 (정보 update)
        this.memberMap.set(memberId, foundMember);
    }

    //멤버십 찾기
    findMembership(clubId: string, memberId: string): ClubMembershipDto | null {
        const foundClub = this.clubMap.get(clubId);
        let membership = null;

        if (foundClub) {
            membership = this.getMembershipOfClub(foundClub, memberId); //멤버십 가져옴
        }

        //멤버십이 존재하면 from Entity to Dto로 보여주고, 아니면 null 리턴
        return membership ? ClubMembershipDto.fromEntity(membership) : null;
    }

    //멤버십 수정 (role 변경)
    modifyMembership(clubId: string, membershipDto: ClubMembershipDto) {
        const targetEmail = membershipDto.memberEmail;
        const newRole = membershipDto.role;

        //클럽의 멤버십 리스트 가져와 역할 수정
        const targetClub = this.clubMap.get(clubId);

        if (targetClub) {
            const membershipOfClub = this.getMembershipOfClub(targetClub, targetEmail);

            membershipOfClub.role = newRole as RoleInClub;
        }

        //네이버에서 내가 속한 클럽에서 정보 (역할) 수정
        const targetMember = this.memberMap.get(targetEmail);

        if (targetMember) {
            targetMember.membershipList.filter(membershipOfMember => membershipOfMember.clubId === clubId)
                                        .map(membershipOfMember => membershipOfMember.role === newRole);
        }
    }

    //멤버십 삭제
    removeMembership(clubId: string, memberId: string): void {
        const foundClub = this.clubMap.get(clubId);
        const foundMember = this.memberMap.get(memberId);

        if (foundClub && foundMember) {
            const clubMembership = this.getMembershipOfClub(foundClub, memberId);

            const clubIndex = foundClub.membershipList.indexOf(clubMembership);
            const memberIndex = foundMember.membershipList.indexOf(clubMembership);

            foundClub.membershipList.splice(clubIndex, 1);
            foundMember.membershipList.splice(memberIndex, 1);
        }
    }

    //내부 메소드
    //이름으로 클럽 한개 찾기
    retrieveByName(name: string): TravelClub | null {
        const clubs = Array.from(this.clubMap.values());

        if (!clubs.length) {
            return null;
        }

        return clubs.find(club => club.name === name) || null;
    }

    //클럽 멤버십에서 특정 이메일을 가진 멤버십 가져오기
    getMembershipOfClub(club: TravelClub, memberId: string): ClubMembership {
        for (const membership of club.membershipList) {
            if (memberId === membership.memberEmail) {          //이메일이 같은 멤버십만
                return membership;
            }
        }
        throw new Error(`No such member[${memberId}] in club [${club.name}]`);
    }
}

export default ClubServiceLogic;