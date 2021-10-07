import fetch from "node-fetch";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

export default async function main(npmReq, passwordReq) {
    const baseUrl = "https://simkuliah.unsyiah.ac.id/index.php";
    
    const getCookie = () => new Promise((resolve, reject) => {
        fetch(`${baseUrl}`)
        .then(res => res.headers.raw()["set-cookie"][0].split("; ")[0])
        .then(resCookie => resolve(resCookie))
        .catch(err => reject(err))
    });
    
    const login = (npm, passwd, cookie) => new Promise((resolve, reject) => {
        fetch(`${baseUrl}/login`, {
            method: "POST",
            body: `username=${npm}&password=${passwd}`,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "cookie": cookie
            }
        })
        .then(res => res.text())
        .then(resText => resolve(resText))
        .catch(err => reject(err))
    });
    
    const adaKelas = (resLogin) => {
        const temp = resLogin.split("var kd_mt_kul_8 = '");
        try {
            const data = temp[1].split("'");
            const kd_mt_kul_8 = data[0];
            const mulai = data[2];
            const akhir = data[4];
            const pertemuan = data[6];
            const sks = data[8];
            const id = data[10];
            const kelas = data[18];
            return `kelas=${kelas}&kd_mt_kul8=${kd_mt_kul_8}&jadwal_mulai=${mulai}&jadwal_berakhir=${akhir}&pertemuan=${pertemuan}&sks_mengajar=${sks}&id=${id}`;
        } catch(err) {
            return false;
        }
    };
    
    const absen = (cookie, payload) => new Promise((resolve, reject) => {
        fetch(`${baseUrl}/absensi/konfirmasi_kehadiran`, {
            method: "POST",
            body: payload,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "cookie": cookie
            }
        })
        .then(res => res.text())
        .then(resText => resolve(resText))
        .catch(err => reject(err))
    });
    
    const cookie = await getCookie();
    const resLogin = await login(npmReq, passwordReq, cookie);
    const payload = adaKelas(resLogin);
    
    if (payload !== false) {
        const resAbsen = await absen(cookie, payload);
        if (resAbsen === "success") {
            return ("success");
        } else {
            return ("no class");
        }
    } else {
        return ("login failed");
    }
}