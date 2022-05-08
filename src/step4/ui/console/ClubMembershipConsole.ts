import TravelClubDto from "../../service/dto/TravelClubDto";
import ClubService from "../../service/ClubService";
import ServiceLycler from "../../service/ServiceLycler";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import ClubMembership from "../../../step1/entity/club/ClubMembership";
import ClubMembershipDto from "../../service/dto/ClubMembershipDto";
import RoleInClub from "../../../step1/entity/club/RoleInClub";

class ClubMembershipConsole {

    currentClub: TravelClubDto | null = null;

    clubService: ClubService;

    constructor() {
        const serviceFactory: ServiceLycler = ServiceLogicLycler.shareInstance();
        this.clubService = serviceFactory.createClubService();
    }

    //선택한 클럽이 있는지
    hasCurrentClub(): boolean {
        return this.currentClub !== null;
    }

    //현재 클럽 이름 가져오기
    requestCurrentClubName(): string | null {
        let clubName = null;

        if (this.hasCurrentClub() && this.currentClub) {
            clubName = this.currentClub.name;
        }
        return clubName;
    }

    //클럽 찾기 ->  currentClub 지정
    findClub(): void {
        let clubFound = null;

        while (true) {
            const clubName = question('\n club name to find (0. Membership Menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                clubFound = this.clubService.findByName(clubName);
                console.log('\n> Found club: ', clubFound);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
            clubFound = null;
        }
        this.currentClub = clubFound;           //currentClub에 현재 찾은 클럽 객체 넣어주기!
    }

    //멤버십 추가
    add(): void {
        if (!this.hasCurrentClub()) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        const email = question('\n member\'s email to add (0. Membership menu): ');

        if (email === '0') {
            return;
        }

        const memberRole = question('President | Member: ');

        try {
            if (this.currentClub) {
                //Entity를 한번 거치는 이유는..?
                const clubMembership = new ClubMembership(this.currentClub.usid, email);
                const clubMembershipDto = new ClubMembershipDto(clubMembership.clubId, clubMembership.memberEmail);

                clubMembershipDto.role = memberRole as RoleInClub;

                this.clubService.addMembership(clubMembershipDto);
                console.log(`\n> Add a member [email: ${email}] in club [name: ${this.currentClub.name}]`);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //멤버십 찾기
    find(): void {
        if (!this.hasCurrentClub()) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        while (true) {
            const memberEmail = question('\n email to find (0. Membership Menu): ');

            if (memberEmail === '0') {
                break;
            }

            try {
                if (this.currentClub) {
                    const membershipDto = this.clubService.findMembershipIn(this.currentClub.usid, memberEmail);
                    console.log('\n> Found membership information: ', membershipDto);
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //멤버십 찾아 Dto로 리턴 -> 수정, 삭제시 이용
    findOne(): ClubMembershipDto | null {
        let membershipDto = null;

        while (true) {
            const memberEmail = question('\n member email to find (0. Membership menu): ');

            if (memberEmail === '0') {
                break;
            }

            try {
                if (this.currentClub) {
                    membershipDto = this.clubService.findMembershipIn(this.currentClub.usid, memberEmail);
                    console.log('\n> Found membership information: ', membershipDto);
                    break;
                }
                //break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return membershipDto;
    }

    //멤버십 수정 - role수정?
    modify(): void {
        if (!this.hasCurrentClub()) {
            console.log('\n> No target club yet. Find target club first.');
            return;
        }

        const targetMembership = this.findOne();

        if (!targetMembership) {
            return;
        }

        const newRole = question('new President | Member (0. Membership Menu, Enter. no change): ');

        if (newRole === '0') {
            return;
        }

        //역할 변경이 수행되었으면
        if (newRole) {
            //Dto에 주입
            targetMembership.role = newRole as RoleInClub;
        }
        const clubId = targetMembership.clubId;

        //클럽 내 멤버십 수정
        this.clubService.modifyMembership(clubId, targetMembership);

        //수정된 내용 가져오기
        const modifyMembership = this.clubService.findMembershipIn(clubId, targetMembership.memberEmail);
        console.log('\n> Modified membership information: ', modifyMembership);
    }

    //멤버십 삭제
    remove(): void {
        if (!this.hasCurrentClub()) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        const targetMembership = this.findOne();

        if (!targetMembership) {
            return;
        }

        const confirmStr = question('Remove this member in the club? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a membership --> ' + targetMembership.memberEmail);

            if (this.currentClub) {
                this.clubService.removeMembership(this.currentClub.usid, targetMembership.memberEmail);
            }
        }
    }
}

export default ClubMembershipConsole;