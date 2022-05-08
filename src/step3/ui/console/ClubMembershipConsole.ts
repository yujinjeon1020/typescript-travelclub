import TravelClubDto from "../../service/dto/TravelClubDto";
import ClubService from "../../service/ClubService";
import ServiceLycler from "../../service/ServiceLycler";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import ClubMembershipDto from "../../service/dto/ClubMembershipDto";
import RoleInClub from "../../../step1/entity/club/RoleInClub";

class ClubMembershipConsole {

    currentClub: TravelClubDto | null = null;

    clubService: ClubService;

    constructor() {

        //this.clubService = ServiceLogicLycler.shareInstance().createClubService();

        const serviceFactory: ServiceLycler = ServiceLogicLycler.shareInstance();
        this.clubService = serviceFactory.createClubService();
    }

    //선택한 클럽이 있는지
    hasCurrentClub(): boolean {
        return this.currentClub !== null;               //null이 아니면 true 리턴 -> 존재할 때만 true 리턴!
    }

    //현재 클럽의 이름 가져오기
    requestCurrentClubName(): string | null {
        let clubName = null;

        if (this.currentClub) {
            clubName = this.currentClub.name;
        }

        return clubName;
    }

    //클럽 찾기
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
            //clubFound = null; -> 굳이..? (위에서 이미 null로 선언됨)
        }
        this.currentClub = clubFound;           //현재 선택한 클럽으로 되게끔
    }

    //Membership Menu
    add(): void {
        if (!this.currentClub) {
            console.log('> No target club yet. Find target club first.');
            return;         //메소드 빠져나감
        }

        //선택한 클럽이 있을 경우
        while (true) {
            const email = question('\n member\'s email to add (0. Member menu): ');

            if (email === '0') {
                return;
            }

            const memberRole = question('President | Member: ');

            try {
                const clubMembershipDto = new ClubMembershipDto(this.currentClub.usid, email);

                //역할 주입
                clubMembershipDto.role = memberRole as RoleInClub;

                this.clubService.addMembership(clubMembershipDto);
                console.log(`\n> Add a member [email: ${email}] in club [name: ${this.currentClub.name}]`);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //이메일로 멤버십 찾기
    find(): void {
        if (!this.currentClub) {
            console.log('\n> No target club yet. Find target club first.');
            return;
        }

        while (true) {
            const memberEmail = question('\n email to find (0. Membership menu): ');

            if (memberEmail === '0') {
                break;
            }

            try {
                const membershipDto = this.clubService.findMembership(this.currentClub.usid, memberEmail);      //dto로 가져옴
                console.log('\n> Found membership information: ' , membershipDto);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
    }

    //이메일로 멤버십 찾기 -> 수정, 삭제에 이용
    findOne(): ClubMembershipDto | null {
        let membershipDto = null;

        while (true) {
            const memberEmail = question('\n member email to find (0. Membership Menu): ');

            if (memberEmail === '0') {
                break;
            }

            try {
                if (this.currentClub) {         //위로 올려서 없을 땐(!) 메소드를 종료하도록 (return) 설정해도 됨
                    membershipDto = this.clubService.findMembership(this.currentClub.usid, memberEmail);
                    console.log('\n> Found membership information: ', membershipDto);
                    break;
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return membershipDto;
    }

    //멤버십 수정하기 -> role 변경하기
    modify(): void {
        if (!this.currentClub) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        const targetMembership = this.findOne();

        if (!targetMembership) {
            return;
        }

        const newRole = question('\n new President | Member (0. Membership Menu, Enter. no change): ');

        if (newRole === '0') {
            return;
        }

        targetMembership.role = newRole as RoleInClub;

        this.clubService.modifyMembership(targetMembership.clubId, targetMembership);
        // = this.clubService.modifyMembership(this.currentClub.usid, targetMembership);


        //수정된 멤버십 조회
        const modifiedMembership = this.clubService.findMembership(targetMembership.clubId, targetMembership.memberEmail);
        console.log('\n> Modified membership information: ' , modifiedMembership);
    }

    //멤버십 제거
    remove(): void {
        if (!this.currentClub) {
            console.log('> No target club yet. Find target club first.');
            return;
        }

        const targetMembership = this.findOne();

        if (!targetMembership) {
            return;
        }

        const confirmStr = question('Remove this member in the club? (Y: yes, N: no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing membership --> ' + targetMembership.memberEmail);

            if (this.currentClub) {
                this.clubService.removeMembership(targetMembership.clubId, targetMembership.memberEmail);
            }
        }
    }
}

export default ClubMembershipConsole;