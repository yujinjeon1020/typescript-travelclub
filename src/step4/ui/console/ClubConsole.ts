import ClubService from "../../service/ClubService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import TravelClubDto from "../../service/dto/TravelClubDto";

class ClubConsole {

    clubService: ClubService;

    constructor() {
        this.clubService = ServiceLogicLycler.shareInstance().createClubService();
    }

    //클럽 등록
    register(): void {
        const clubName = question('\ club name (0. Club menu): ');

        if (clubName === '0') {
            return;
        }

        const clubIntro = question(' club intro (0. Club menu): ');

        if (clubIntro === '0') {
            return;
        }

        try {
            //dto에 주입
            const clubDto = new TravelClubDto(clubName, clubIntro);
            this.clubService.register(clubDto);
            console.log('\n> Registered Club: ' , clubDto);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //클럽 찾기
    find(): TravelClubDto | null {
        let clubFound = null;

        while (true) {
            const clubName = question('\n club name to find (0. Club menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                clubFound = this.clubService.findByName(clubName);
                console.log('\n> Found club: ', clubFound);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return clubFound;
    }

    //클럽 찾기 -> 수정, 삭제 시 이용
    findOne(): TravelClubDto | null {
        let clubFound = null;

        while (true) {
            const clubName = question('\n club name to find (0. Club menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                clubFound = this.clubService.findByName(clubName);
                console.log('\n> Found club: ',  clubFound);
                break;
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return clubFound;
    }

    //클럽 수정
    modify(): void {
        const targetClub = this.findOne();

        if (!targetClub) {
            return;
        }

        const newName = question('\n New club name (0. Club menu, Enter. no change): ');

        if (newName === '0') {
            return;
        }

        //Dto에 변경된 이름 주입
        if (newName) {
            targetClub.name = newName;
        }

        const newIntro = question(' New club intro (Enter. no change): ');

        //Dto에 변경된 intro 주입
        if (newIntro) {
            targetClub.intro = newIntro;
        }

        try {
            this.clubService.modify(targetClub);            //리턴값 void
            console.log('\n> Modified club: ', targetClub);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //클럽 삭제
    remove(): void {
        const targetClub = this.findOne();

        if (!targetClub) {
            return;
        }

        const confirmStr = question('Removing this club? (Y:yes, N:no): ');

        if (confirmStr.toLowerCase() === 'y' || confirmStr.toLowerCase() === 'yes') {
            console.log('\n> Removing a club --> ' + targetClub.name);
            this.clubService.remove(targetClub.usid);
        } else {
            console.log('\n> Remove cancelled, your club is safe. --> ' + targetClub.name);
        }
    }
}

export default ClubConsole;