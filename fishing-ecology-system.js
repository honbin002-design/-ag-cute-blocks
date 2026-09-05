// AG Cute Blocks fishing ecology rules.
// Keeps the existing V0.5 economy item ids so catches continue to use one backpack/shipping system.
const FISH_IDS=['smallFish','riverFish','goldFish'];
const BASE={smallFish:.50,riverFish:.32,goldFish:.18};
const SEASON={
  spring:{smallFish:-.04,riverFish:.05,goldFish:-.01},
  summer:{smallFish:.05,riverFish:.01,goldFish:-.06},
  autumn:{smallFish:-.06,riverFish:.01,goldFish:.05},
  winter:{smallFish:-.08,riverFish:.06,goldFish:.02}
};
const WEATHER={
  sunny:{},cloudy:{smallFish:-.02,riverFish:.02},
  rain:{smallFish:-.08,riverFish:.07,goldFish:.01},
  thunderstorm:{smallFish:-.12,riverFish:.06,goldFish:.06},
  fog:{smallFish:-.05,riverFish:.02,goldFish:.03},
  snow:{smallFish:-.06,riverFish:.05,goldFish:.01}
};
const TIME={
  dawn:{smallFish:-.06,riverFish:.05,goldFish:.01},
  day:{smallFish:.04,goldFish:-.04},
  dusk:{smallFish:-.08,riverFish:.04,goldFish:.04},
  night:{smallFish:-.08,riverFish:.02,goldFish:.06}
};
function add(target,delta={}){for(const id of FISH_IDS)target[id]+=Number(delta[id]||0)}
export function fishingTimeBand(minute=720){const m=((Number(minute)||0)%1440+1440)%1440,h=m/60;if(h>=5&&h<8)return'dawn';if(h>=8&&h<17)return'day';if(h>=17&&h<20)return'dusk';return'night'}
export function getFishingWeights({season='spring',weather='sunny',minute=720}={}){const weights={...BASE};add(weights,SEASON[season]);add(weights,WEATHER[weather]);add(weights,TIME[fishingTimeBand(minute)]);let total=0;for(const id of FISH_IDS){weights[id]=Math.max(.05,weights[id]);total+=weights[id]}for(const id of FISH_IDS)weights[id]/=total;return weights}
export function chooseFish(context={},random=Math.random){const w=getFishingWeights(context),r=Math.max(0,Math.min(.999999,Number(random())||0));let cursor=0;for(const id of FISH_IDS){cursor+=w[id];if(r<cursor)return id}return'goldFish'}
export function fishRollForLegacyThreshold(fish){return fish==='smallFish'?.25:fish==='riverFish'?.65:.91}
export const FISHING_ECOLOGY_SCHEMA=1;
export const FISHING_ECOLOGY_IDS=Object.freeze([...FISH_IDS]);
