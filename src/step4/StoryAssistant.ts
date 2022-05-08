import TravelClubDto from "./service/dto/TravelClubDto";
import MemberDto from "./service/dto/MemberDto";
import ServiceLogicLycler from "./logic/ServiceLogicLycler";
import ClubMembershipDto from "./service/dto/ClubMembershipDto";
import MainMenu from "./ui/menu/MainMenu";

const sampleClubDto = new TravelClubDto('namoosori club', 'Welcome to namoosori club.');
const sampleMemberDto = new MemberDto('namoosori@test.co.kr', 'Minsoo Lee', '010-3321-1001');

const lycler = ServiceLogicLycler.shareInstance();
const clubService = lycler.createClubService();
const memberService = lycler.createMemberService();

clubService.register(sampleClubDto);
memberService.register(sampleMemberDto);
clubService.addMembership(new ClubMembershipDto('0', 'namoosori@test.co.kr'));

const mainMenu = new MainMenu();

mainMenu.showMenu();