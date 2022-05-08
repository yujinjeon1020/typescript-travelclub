import ClubStore from "../store/ClubStore";
import MemoryMap from "./io/MemoryMap";
import TravelClub from "../../step1/entity/club/TravelClub";
import clubStore from "../store/ClubStore";

class ClubMapStore implements ClubStore {

    clubMap: Map<string, TravelClub>;
    autoIdMap: Map<string, number>;

    constructor() {
        this.clubMap = MemoryMap.getInstance().clubMap;
        this.autoIdMap = MemoryMap.getInstance().autoIdMap;
    }

    create(club: TravelClub): string {
        const targetClub = this.clubMap.get(club.getId());

        if (targetClub) {
            throw new Error('Club already exists with id: ' + targetClub.getId());
        }
        const className = TravelClub.name;                                  //TravelClub 클래스 이름 자체를 className에 저장 className = TravelClub

        if ('getId' in club || 'setAutoId' in club) {                       //해당 메소드가 해당 객체 클래스에 존재하는지 (무조건 true)
            if (this.autoIdMap.get(className) === undefined) {              //TravelClub의 번호가 없으면 (처음 시작시)
                this.autoIdMap.set(className, Number(club.getId()));        //club.getId()=null 이므로 Number로 변환시 0됨
            }
            // console.log(className);         //TravelClub
            // console.log(this.autoIdMap);    //Map(1) { 'TravelClub' => 1 } (원래는 0부터 시작하는데 StoryAssistant에서 클럽 등록이 이미 실행되므로 1임)

            let keySequence = this.autoIdMap.get(className);                //위와 같이 0을 가져와서 keySequence는 0이 됨

            if (keySequence !== undefined) {                                //0도 define 된거니까 undefined 아니라서 실행됨
                const autoId = keySequence.toString();                      //숫자 0을 문자열로 변환 (setAutoId 메소드에서 autoId는 string 타입이라서)

                club.setAutoId(autoId);                                     //클럽의 id를 설정해주고 (0)

                //autoIdMap은 그냥 클럽의 id를 +1씩 올려주기 위한 것이므로 clubMap과는 별개
                this.autoIdMap.set(className, ++keySequence);               //className=TravelClub, ++keySequence=1 (0에서 증감연산자 사용)

            }
        }
        this.clubMap.set(club.getId(), club);                               //club.getId()=0, club=TravelClub 객체 (새로만든 클럽)

        //console.log(this.clubMap);

        return club.getId();
    }

    //Select
    retrieve(clubId: string): TravelClub | null {
        return this.clubMap.get(clubId) || null;
    }

    //Select
    retrieveByName(name: string): TravelClub | null {
        const clubs = Array.from(this.clubMap.values());

        if (!clubs.length) {
            return null;
        }

        return clubs.find(club => club.name === name) || null;      //find는 조건에 맞는 것 하나만 찾아 객체 하나를 리턴하고, filter는 조건에 맞는 것 다 찾아서 배열로 리턴
    }

    //Update
    update(club: TravelClub): void {
        this.clubMap.set(club.getId(), club);
    }

    //Delete
    delete(clubId: string): void {
        this.clubMap.delete(clubId);
    }

    //exists
    exists(clubId: string): boolean {
        return this.clubMap.get(clubId) !== undefined;
    }
}

export default ClubMapStore;