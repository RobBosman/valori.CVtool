"use strict";

export const heavyWait = (remark = '', waitMillis = 1000) => {
    if (waitMillis > 0) {
        console.log(`    ${remark} - waiting ${waitMillis} ms...`);
        let now = new Date().getTime();
        let end = now + waitMillis;
        while (now < end) {
            now = new Date().getTime();
        }
    }
};