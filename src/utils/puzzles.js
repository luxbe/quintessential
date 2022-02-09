// 'starts from 2021-02-07'
import { RANDOMS } from './randomPuzzles'

// prettier-ignore
export const DAILIES = [
  ['pizza,bacon,sauce,curds,crust', 'sucsc,uaudn,pabae,zcros,crizt', 'food'], 
  ['herbs,thyme,onion,basil,chard', 'hnobh,ssyce,oeirr,bdtil,mahna', 'food'], 
  ['swine,rhino,tapir,fitch,zebra', 'pwhnr,riiaf,easre,otich,ztbin', 'animals'], 
  ['koala,steer,horse,lemur,tiger', 'eomrl,htkei,surse,agaol,treer', 'animals'], 
  ['china,india,japan,napal,yemen', 'cjaae,iadpn,hapnn,aniil,namey', 'countries'], 
  ['spain,samoa,qatar,syria,italy', 'satmr,riiop,laaas,yynia,ataqs', 'countries'], 
  ['bagel,cream,caper,seeds,toast', 'ragtt,cbeea,odpee,sraas,ecmsl', 'food'], 
  ['sushi,knife,algae,trout,gills', 'gnsti,luioe,rlgat,eafsh,silku', 'food'], 
  ['space,phase,probe,cloak,prime', 'srrke,bhesm,ppopa,olcac,eaiep', 'starrek'], 
  ['spock,riker,quark,seven,phlox', 'qiokc,lpksr,sraun,eevek,xhrop', 'starrek'], 
  ['chimp,sheep,tabby,panda,bison', 'eboma,pehcp,tadhb,spnba,yisin', 'animals'], 
  ['sloth,hippo,camel,shrew,moose', 'lseph,hsptl,caheo,emosw,morio', 'animals'], 
  ['melon,apple,grape,peach,lemon', 'megeo,pmelp,leapo,arach,lnpne', 'fruit'], 
  ['limes,berry,kiwis,pears,mango', 'kieei,amrsy,liwsr,pgbns,oarem', 'fruit'], 
  ['wires,chain,board,plane,knife', 'pfnec,shnda,noaii,wlare,kbrie', 'tools'], 
  ['screw,nails,drill,bolts,bench', 'bnrba,cwirs,dlihl,eoets,slcnl', 'tools'], 
  ['blues,swing,metal,salsa,disco', 'buums,itiac,ehwnl,eolse,ossgd', 'music'], 
  ['urban,samba,house,dance,indie', 'uosen,bueba,irada,eancd,hnsim', 'music'], 
  ['bruce,peggy,clint,bucky,shuri', 'ckcbe,yeigp,crihb,tuury,snulg', 'marvel'], 
  ['widow,peter,stark,quill,carol', 'lodea,poter,ltwli,ruksr,caqiw', 'marvel'], 
  ['drink,latte,break,beans,steam', 'kannb,lemse,traad,keais,tbert', 'coffee'], 
  ['mocha,irish,cream,sugar,brown', 'manis,hriar,rrwom,bugah,scoec', 'coffee'], 
  ['whale,llama,skunk,hyena,mouse', 'wknly,elsms,ahmnh,keeaa,uoual', 'animals'], 
  ['sable,stoat,otter,puppy,dingo', 'tirle,sspto,ytaeb,pnpoo,daugt', 'animals'], 
  ['honda,tesla,chevy,buick,acura', 'henul,ucsaa,hcoay,bdicr,aetkv', 'cars'], 
  ['dodge,lexus,mazda,scion,volvo', 'dogdi,mvaaz,lxsdu,csvon,eoleo', 'cars'], 
  ['argon,noble,joule,flask,bonds', 'nfgjn,aobds,olalb,rouek,eonls', 'chemistry'], 
  ['alloy,boron,atoms,radon,xenon', 'obeoa,losdn,ynomr,naoan,xltor', 'chemistry'], 
]

let dailies = [...DAILIES]
export const PUZZLES = [...RANDOMS]
let i = 5
while (dailies.length > 1) {
  PUZZLES.splice(i, 0, dailies.shift())
  PUZZLES.splice(i + 1, 0, dailies.shift())
  i += 7
}
