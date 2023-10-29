var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

//========= Web/猫 =========//
// Compatible with WebNeko! //
//==========================//
//== Now works with ECMA5 ==//
//==========================//
// Licensed under the WTFPL //
//==========================//

// A copy of the license can be found on https://b1nary.tk/dummyneko/#license
// Download the latest version from https://b1nary.tk/dummyneko/main.js

/* NOTE: WIP, incomplete implementation.
 * What's working?
 * - state_still
 * - state_yawn
 * - state_sleep
 * - state_alert
 * - state_run
 * Comming soon:
 * - state_scratch
 * - state_itch
 * - home position
 *
 * Known bugs:
 * - default `display_state` updates image source, and some browsers (e.g.
 *   Chrome) cancel unfinished downloads. Extremely low-bandwidth network users
 *   never receive the neko (unless they manually preload it)!
 *   Fix: use `display_state` to display preloaded images
 *             (could be done without changing this file)
 *
 * You can find demo on the page below:
 *   https://b1nary.tk/dummyneko/
 * I'm also using this script on my website:
 *   https://b1nary.tk/
 * And I've published this project on GitHub:
 *   https://github.com/b1narykid/dummyneko
 */

'use strict'

// normal time between state transition, ms
const dt = 300
// max distance between cursor and cat
const dmax = 15
// speed per `dt` ms
const step = 15

/* Current mouse position */
var mx = 0
var my = 0

document.addEventListener('mousemove', mouseUpdate, false)
document.addEventListener('mouseenter', mouseUpdate, false)
function mouseUpdate(e) {
  mx = e.pageX
  my = e.pageY
}

// - utils
// you can change how element changes its position (`commit` function),
//                            displays image for some state (`display_state`),
// change `make_step` function or define new state display names.
// `states` table exists only as a reference for designers but you may use it
// for your needs (e.g., return default value for undefined state names in
// `display_name` function).

// List of all possible state display names
const states = [ "alert"
               , "still"
               , "yawn"
               , "itch1"    , "itch2"
               , "sleep1"   , "sleep2"
               // run
               , "nrun1"    , "nrun2"
               , "nerun1"   , "nerun2"
               , "erun1"    , "erun2"
               , "serun1"   , "serun2"
               , "srun1"    , "srun2"
               , "swrun1"   , "swrun2"
               , "wrun1"    , "wrun2"
               , "nwrun1"   , "nwrun2"
               // scratch
               , "nscratch1", "nscratch2"
               , "escratch1", "escratch2"
               , "sscratch1", "sscratch2"
               , "wscratch1", "wscratch2"
               ]

// name - state name
// dir  - direction (optional)
// n    - state iteration (optional)
let display_name = function(name, n, dir) {
  return (dir ? dir : '') + name + (n ? n : '')
}

let display_state = function(e, name) {
  e.src = '/ass/webneko.net/socks/' + name + '.gif'
}

// commit changes in element's position
let commit = function(e, x, y) {
  e.style.top  = y + 'px'
  e.style.left = x + 'px'
}

// get one step closer to the pointer
let make_step = function(p) {
  let d = distance(p.x, p.y)
  if(d > 0) {
    let dx = p.x - mx
    let dy = p.y - my
    let dstep = step / d

    p.x -= dstep * dx
    p.y -= dstep * dy
  }
}

// state transition with delay
let transit = function(state, nrepeat) {
  if(nrepeat == undefined) nrepeat = 1
  setTimeout(state, dt * nrepeat)
}

// - general math
// most likely you do not have to change anything in this section.

const π = Math.PI
// If you want to want to have the major directions only:
//   angleMap.filter((_, i) => !(i&1))
const angleMap = [ [     0, 'w' ]
                 , [ π*1/4, 'nw']
                 , [ π / 2, 'n' ]
                 , [ π*3/4, 'ne']
                 , [     π, 'e' ]
                 , [-π*1/4, 'sw']
                 , [-π / 2, 's' ]
                 , [-π*3/4, 'se']
                 , [    -π, 'e' ]
                 ]


/* * * * * * */
/* NW  ↑  NE */
/*     N     */
/* ← W ☼ E → */
/*     S     */
/* SW  ↓  SE */
/* * * * * * */
function direction(x, y, dirs) {
  if(dirs == undefined) dirs = angleMap

  let dx = x - mx
  let dy = y - my
  let α = Math.atan2(dy, dx)

  for (let element of dirs) {
   let key = element[0], val = element[1]
   let β = α - key
   if (-π/8 <= β && β <= π/8) {
     return val
   }
  }

  return ''
}

function distance(x, y) {
  let dx = x - mx
  let dy = y - my
  return Math.sqrt(dx*dx + dy*dy)
}

function pointerNearby(p) {
  return distance(p.x, p.y) <= dmax
}

// - states

function state_still(p, e, n) {
  if(n == undefined) n = 0
  let next = (n + 1) & 0xFF

  if(!pointerNearby(p)) {
    return state_alert(p, e)
  }

  if(15 <= n && n <= 18) {
    return state_yawn(p, e, next)
  }
  if(n > 20) {
    return state_sleep(p, e)
  }

  let state = display_name('still')
  display_state(e, state)

  return transit(
    function() { return state_still(p, e, next) }
  )
}

// here `n` is iteration of still state, not yawn state
function state_yawn(p, e, n) {
  if(!pointerNearby(p)) {
    return state_still(p, e)
  }

  let state = display_name('yawn')
  display_state(e, state)

  return transit(
    function() { return state_still(p, e, n) }
  )
}

function state_sleep(p, e, n) {
  if(n != 1 && n != 2) n = 1

  // wake up!
  if(!pointerNearby(p)) {
    return state_still(p, e)
  }

  let state = display_name('sleep', n)
  display_state(e, state)

  return transit(
    function() { return state_sleep(p, e, (n&1)+1) },
    2
  )
}

function state_alert(p, e) {
  let state = display_name('alert')
  display_state(e, state)

  return transit(
    function() { return state_run(p, e) },
    2 // * -> alert -> alert -> run
  )
}

function state_run(p, e, n) {
  if(n != 1 && n != 2) n = 1

  if(pointerNearby(p)) {
    return state_still(p, e, n)
  }

  make_step(p)
  commit(e, p.x, p.y)
  let state = display_name('run', n, direction(p.x, p.y))
  display_state(e, state)

  return transit(
    function() { return state_run(p, e, (n&1)+1) }
  )
}


}
/*
     FILE ARCHIVED ON 15:08:58 Sep 30, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:20:17 Oct 29, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 98.815
  exclusion.robots: 0.221
  exclusion.robots.policy: 0.199
  cdx.remote: 0.104
  esindex: 0.015
  LoadShardBlock: 68.946 (3)
  PetaboxLoader3.datanode: 145.864 (5)
  load_resource: 5376.084 (2)
  PetaboxLoader3.resolve: 5262.509 (2)
*/
