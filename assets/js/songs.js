/* ==========================================================================
   DATA LAGU — Sound Of Drive · 30 lagu · 3 album
   Satu-satunya tempat untuk mengubah data musik. Beranda (rilis terbaru,
   meter 30 lagu, grid playlist) dan halaman Musik membaca dari file ini.

   Cara update:
   - Lagu rilis      → ubah `released: false` jadi `true`, isi `date`, `platforms`,
                       `lyrics`, dan (opsional) `spotify` + `article`.
   - Umumkan lagu    → tambahkan objek baru dengan `num` (1–30) dan `title`.
   - Nomor 1–30 yang tidak ada di `songs` otomatis tampil sebagai slot kosong.
   - `date` pakai format YYYY-MM-DD.
   ========================================================================== */
window.XYTOZA_MUSIC = {
  total: 30,

  // Link default bila sebuah lagu belum punya link platform sendiri
  platforms: {
    spotify: 'https://open.spotify.com/album/5fIX8CkF5G1vURPi1IHc38?si=YrJ2Iey1QeqaZnZHZvJYLQ',
    apple: 'https://music.apple.com/us/artist/xytoza/6801004025',
    ytmusic: 'https://music.youtube.com/watch?v=9Q7sF3aS8go&si=FOTZiL_yanD_QyF3',
    youtube: 'https://youtu.be/_xLQrGW3O08'
  },

  albums: [
    { id: 'album1', vol: '01', title: 'Obrolan Cermin', desc: 'Speaking melodies to the mirror as a daily affirmation to rise up.' },
    { id: 'album2', vol: '02', title: 'Coming Soon', desc: 'Committing to daily repetition until progress becomes second nature.' },
    { id: 'album3', vol: '03', title: 'Coming Soon', desc: 'Setting the mind free and letting the inner strength finally sing out loud.' }
  ],

  songs: [
    {
      num: 1,
      title: 'Satu Paket',
      released: true,
      date: '2026-09-11',
      art: 'https://ik.imagekit.io/5bnhlcghq/ChatGPT%20Image%20Aug%2012,%202026,%2006_30_10%20PM.png',
      note: 'Hidup datang sebagai satu paket: senang dan sedih, menangis dan tertawa, jatuh dan bangkit. Lagu pembuka perjalanan Sound Of Drive.',
      spotify: 'album/5fIX8CkF5G1vURPi1IHc38',
      article: 'artikel/rilis_lagu_satu_paket.html',
      lyrics: `Hidup ini satu paket tak bisa ditawar
Ada senang ada sedih, menangis dan tertawa
Hidup ini satu paket tak bisa ditawar
Siang malam hujan panas
Datang pergi jatuh bangkit

Hidup ini mudah tapi juga susah
Hidup menyenangkan kadang menyedihkan
Hidup mengasyikan juga membosankan
Hidup ini indah juga melelahkan

Jika nanti bahagia rendah hati tak sombong
Bila nanti bersedih tetap sabar dan tabah
Bila nanti terjadi… Bergumulah…`
    },
    {
      num: 2,
      title: 'Tabur Tuai',
      released: true,
      date: '2026-09-25',
      art: 'https://ik.imagekit.io/5bnhlcghq/asf.png',
      note: 'Hukum sebab-akibat dalam hidup: apa yang kita tabur lewat usaha, kejujuran, dan disiplin, itu jugalah yang akan kita tuai.',
      spotify: 'album/3Fvmis78wSwHEFatvQvECQ',
      article: 'artikel/rilis_lagu_tabur_tuai.html',
      platforms: {
        spotify: 'https://open.spotify.com/album/3Fvmis78wSwHEFatvQvECQ',
        apple: 'https://music.apple.com/us/album/tabur-tuai-single/6813613985',
        ytmusic: 'https://music.youtube.com/watch?v=Lf_PM6WbN70&list=OLAK5uy_mqRblozcMC_vsIMPqT0OzZGgd1R2SpVao',
        youtube: 'https://www.youtube.com/watch?v=Lf_PM6WbN70'
      },
      lyrics: `Taburlah tabur apapun yang kau mau
Tuailah tuai itulah yang kau mau
Taburlah tabu apapun yang kau mau
Tuailah tuai itulah yang kau mau

Takan mungkin bila menabur biji Gulma
Dan mengharapkan menuai buah anggur
Takan mungkin bila menabur kemalasan
Dan mengharapkan keberhasilan

Taburlah disiplin belajar, tuailah pengetahuan
Taburlah benih kejujuran, tuai kepercayaan
Takan mungkin membangun rumah tanpa pondasi
Dan mengharapkan punya rumah yang kokoh
Takan mungkin tak berusaha tak berlatih
Dan mengharapkan jadi Sang Juara

Takan mungkin bila menabur biji Gulma
Dan mengharapkan menuai buah anggur
Takan mungkin bila menabur keburukan
Dan mengharapkan tuai kebaikan`
    },
    {
      num: 3,
      title: 'Minggir Loe Miskin',
      released: true,
      date: '2026-10-09',
      art: 'https://ik.imagekit.io/5bnhlcghq/artwork_mlm1.png',
      note: 'Bukan soal dompet kosong, tapi soal mental. Tak punya uang hanya sementara; bermental miskin bisa selama-lamanya. Teruslah berusaha, jangan malu, jangan ragu.',
      article: 'artikel/rilis_lagu_minggir_loe_miskin.html',
      spotify: 'album/3G2rXfR3d646Vnowwb6k1N',
      platforms: {
        spotify: 'https://open.spotify.com/album/3G2rXfR3d646Vnowwb6k1N',
        apple: 'https://music.apple.com/us/album/minggir-loe-miskin-single/6801771162',
        ytmusic: 'https://music.youtube.com/watch?v=lvnadP9KoYE',
        youtube: 'https://www.youtube.com/watch?v=eFl72RtNAY0'
      },
      lyrics: `Hai Laki-laki janganlah jadi miskin
Hidup tak adil buat orang miskin
Hai laki-laki jangan bermental miskin
Dunia tak adil buat orang miskin

Hobbylah belajar, terus berusaha
Agar kelak kau tak jadi miskin
Hargai gurumu yang gajinya kecil
Buatlah bangga orang tuamu

Hai Laki-laki berdirilah berani
Hadapi dunia dengan gagah berani
Hai laki-laki kejarlah cita-citamu
Agar kelak kau tak jadi miskin

Tak punya uang hanya sementara
Bermental miskin bisa selama-lamanya
Carilah cara untuk terus berusaha
Harga diri lelaki itu berusaha

Teruslah berusaha jangan pernah takut
Jangan malu, jangan ragu teruslah maju
Teruslah berusaha jangan pernah takut
Jangan malu, jangan ragu teruslah maju
….
Jangan mau kau dibilang…Minggir loe Miskin`
    },
    {
      num: 4,
      title: 'Tim Impian',
      released: false,
      art: 'https://ik.imagekit.io/5bnhlcghq/tim.png'
    }
  ]
};
