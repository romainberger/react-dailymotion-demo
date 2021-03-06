import request from 'superagent'
import Promise from 'bluebird'

const cache = {}

export default function getUserInfos(id = false) {
    return new Promise((resolve) => {
        if (!id) {
            resolve(null)
            return
        }

        if (typeof cache[id] === 'object') {
            resolve(cache[id])
            return
        }

        request('GET', `https://api.dailymotion.com/user/${id}/videos?fields=id,title,thumbnail_360_url&limit=12`)
            .send()
            .set('Accept', 'application/json')
            .end((err, res) => {
                cache[id] = res.body
                resolve(cache[id])
            })
    })
}
