import ClubService from "../../service/ClubService";
import ServiceLogicLycler from "../../logic/ServiceLogicLycler";
import {question} from "readline-sync";
import TravelClubDto from "../../service/dto/TravelClubDto";
import TravelClub from "../../../step1/entity/club/TravelClub";

class ClubConsole {

    clubService: ClubService;

    constructor() {
        this.clubService = ServiceLogicLycler.shareInstance().createClubService();
    }

    //클럽 등록
    register(): void {
        const clubName = question('\n club name (0. Club Menu): ');

        if (clubName === '0') {
            return;
        }

        const clubIntro = question('club intro (0. Club menu): ');

        if (clubIntro === '0') {
            return;
        }

        try {
            const clubDto = new TravelClubDto(clubName, clubIntro);
            this.clubService.register(clubDto);
            console.log('\n> Registered Club: ', clubDto);
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
            const clubName = question('\n club name to find (0. Club Menu): ');

            if (clubName === '0') {
                break;
            }

            try {
                clubFound = this.clubService.findByName(clubName);
                console.log('\n> Found club: ' , clubFound);
            } catch (e) {
                if (e instanceof Error) {
                    console.error(`Error: ${e.message}`);
                }
            }
        }
        return clubFound;
    }

    //클럽 찾기
    findOne(): TravelClubDto | null {
        let clubFound = null;

        while (true) {
            const clubName = question('\n club name to find (0. Club Menu): ');

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
        }
        return clubFound;
    }

    //클럽 수정
    modify(): void {
        const targetClub = this.findOne();

        if (!targetClub) {
            return;
        }

        //이름 수정
        const newName  = question('\n New club name (0. Club menu, Enter. no change): ');

        if (newName === '0') {
            return;
        }

        if (newName) {
            targetClub.name = newName;
        }

        //INTRO 수정
        const newIntro = question('\n New club intro (Enter. no change): ');

        if (newIntro) {
            targetClub.intro = newIntro;
        }

        try {
            this.clubService.modify(targetClub);
            console.log('\n> Modified club: ', targetClub);
        } catch (e) {
            if (e instanceof Error) {
                console.error(`Error: ${e.message}`);
            }
        }
    }

    //클럽 제거
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
            console.log('\n> Remove cancelled, your club is safe. -->' + targetClub.name);
        }
    }
}

export default ClubConsole;