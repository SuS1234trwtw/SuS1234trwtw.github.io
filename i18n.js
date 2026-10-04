/* EN / VI. English lives in the HTML; elements tagged data-i18n="key" (and data-i18n-attr="attr:key;attr:key")
   swap to the Vietnamese below. Page scripts read strings through T(key, english) and redraw on the
   "langchange" event. Loaded in <head> so T exists before any page script runs. */
(function () {
  var VI = {
    /* nav + footer (index, install, confirmed) */
    'nav.install': 'Cài đặt',
    'nav.privacy': 'Bảo mật',
    'nav.terms': 'Điều khoản',
    'nav.source': 'Mã nguồn',
    'foot.rights': 'Bảo lưu mọi quyền',
    'foot.privacy': 'Bảo mật',
    'foot.terms': 'Điều khoản',
    'foot.contact': 'Liên hệ',
    'foot.source': 'Mã nguồn',

    /* index: boot */
    'idx.title': 'Focus — Hẹn giờ Pomodoro cho iPhone',
    'boot.top': 'focus &mdash; khởi động &mdash; tty1 &mdash; 80&times;24',
    'boot.sys': '// hệ thống',
    'boot.mem': 'ram',
    'boot.net': 'mạng',
    'boot.mod': '// mô-đun',
    'boot.sig': '// tín hiệu',
    'boot.up': '// thời gian chạy',
    'boot.sub': 'pomodoro &middot; việc cần làm &middot; island',
    'boot.skip': 'chạm hoặc bấm phím bất kỳ để bỏ qua',
    'boot.s.post': 'kiểm tra',
    'boot.s.modules': 'mô-đun',
    'boot.s.sync': 'đồng bộ',
    'boot.s.fonts': 'phông chữ',
    'boot.s.shell': 'shell',
    'boot.s.render': 'dựng hình',
    'boot.s.ready': 'sẵn sàng',
    'boot.l1': '<span class="hl">focus-os 1.8.0</span> (bản 18) &mdash; đang khởi động trên tty1',
    'boot.l2': 'cpu: 6 nhân đã chạy &middot; neural engine sẵn sàng',
    'boot.l3': 'bộ nhớ: đã ánh xạ 0x0000f000&ndash;0x7ffe3a10 &middot; 8.0 gb',
    'boot.m1': 'bộ máy hẹn giờ',
    'boot.m2': 'rung phản hồi',
    'boot.m3': 'chuông &middot; âm thanh',
    'boot.m4': 'dynamic island',
    'boot.m5': 'hoạt động trực tiếp',
    'boot.m6': 'widget',
    'boot.y1': 'gắn ~/tasks (supabase)',
    'boot.y2': 'cầu nối spotify',
    'boot.y3': 'google calendar',
    'boot.f1': 'phông: geist mono &middot; 3 độ đậm',
    'boot.h1': 'đang mở focus shell',
    'boot.init': 'khởi tạo',
    'boot.ok': 'ổn',
    'boot.idle': 'chờ',
    'boot.cmd': '$ focus --bắt-đầu',

    /* index: live timer + island (drawn by JS) */
    'mode.focus': 'Tập trung',
    'mode.break': 'Nghỉ',
    'st.session': 'phiên {n}',
    'paused': 'đã dừng',
    'ctl.pause': 'tạm dừng',
    'ctl.start': 'chạy',
    'ctl.switch': '&#8644; chuyển',
    'ctl.reset': '&#8634; đặt lại',
    'm.focus': 'TẬP TRUNG',
    'm.break': 'NGHỈ',
    'island.aria': 'Dynamic Island, chạm để mở rộng',

    /* index: hero */
    'hero.time': 'Đồng hồ Focus, chạm để tạm dừng hoặc chạy tiếp',
    'hero.tag': 'Hẹn giờ Pomodoro và danh sách việc cần làm tối giản cho iPhone, mang chất terminal.',
    'hero.install': '+ Cài đặt',
    'hero.source': 'Mã nguồn &#8599;',
    'hero.hint': 'chạm vào đồng hồ để tạm dừng &middot; nó chạy thật đấy',
    'hero.scroll': 'cuộn<i>&darr;</i>',

    /* index: phone screenshots */
    'shot.soon': 'ảnh chụp màn hình sắp có',
    'shot.timer': 'hẹn giờ',
    'shot.tasks': 'việc cần làm',
    'shot.lock': 'màn hình khóa',
    'shot.calendar': 'lịch',
    'alt.timer': 'Focus đang hiện đồng hồ trong một phiên tập trung',
    'alt.tasks': 'Focus đang hiện danh sách việc cần làm',
    'alt.lock': 'Màn hình khóa với đồng hồ Focus trong Hoạt động trực tiếp',
    'alt.spotify': 'Focus đang hiện bài hát phát trên Spotify',
    'alt.calendar': 'Google Calendar hiện các phiên Focus đã được ghi lại',
    'alt.widget': 'Widget Focus trên Màn hình chính',

    /* index: chapters */
    'c1.idx': '[01] &middot; hẹn giờ',
    'c1.h': 'Tập trung. Nghỉ.<br><span class="soft">Lặp lại.</span>',
    'c1.sub': 'Hẹn giờ tập trung &amp; nghỉ với thời lượng tùy chỉnh, âm thanh và rung phản hồi.',
    'c2.idx': '[02] &middot; việc cần làm',
    'c2.h': 'Danh sách của bạn.<br><span class="soft">Ở mọi nơi.</span>',
    'c2.sub': 'Việc cần làm đơn giản, đồng bộ trên mọi thiết bị của bạn.',
    'tasks.left': 'còn {n}',
    'tasks.done': 'xong hết',
    'tasks.add': 'thêm việc, nhấn enter',
    'tasks.addlbl': 'Thêm việc',
    'task.1': 'lên dàn ý bài luận',
    'task.2': 'trả lời email',
    'task.3': 'đọc chương 4',
    'task.4': 'lên kế hoạch ngày mai',
    'c3.idx': '[03] &middot; dynamic island',
    'c3.h': 'Ở ngay trên<br><span class="soft">Dynamic Island.</span>',
    'c3.sub': 'Đếm ngược trực tiếp trên Dynamic Island và màn hình khóa. Giữ để tạm dừng hoặc đổi chế độ.',
    'c3.tip': '<span class="tip-up">&uarr; </span>chạm hoặc giữ island trên điện thoại<span class="tip-right"> &rarr;</span>',
    'c4.idx': '[04] &middot; spotify',
    'c4.h': 'Âm nhạc,<br><span class="soft">trong tầm tay.</span>',
    'c4.sub': 'Tùy chọn: xem và điều khiển bài đang phát. Thử ngay ở đây với nhạc được tạo trực tiếp trong trình duyệt, mỗi bài một kiểu ngẫu nhiên và không dính bản quyền.',
    'c5.idx': '[05] &middot; google calendar',
    'c5.h': 'Mỗi phiên,<br><span class="soft">đều được ghi lại.</span>',
    'c5.sub': 'Tùy chọn: ghi các phiên tập trung đã xong vào lịch &ldquo;Focus&rdquo;.',
    'cal.bar': 'lịch &middot; focus',
    'cal.today': 'hôm nay',
    'cal.focus': 'tập trung &middot; 25 phút',
    'cal.break': 'nghỉ &middot; 5 phút',
    // ready but NOT tagged in index.html: this paragraph is part of the Google OAuth verification text
    'cal.how': '<strong>Focus dùng Google Calendar như thế nào.</strong> Kết nối Google Calendar là tùy chọn. Khi bạn kết nối, Focus tạo một lịch phụ tên &ldquo;Focus&rdquo; trong tài khoản Google của bạn và thêm một sự kiện vào đó mỗi khi bạn xong một phiên tập trung (và mỗi lần nghỉ, nếu bạn bật). Focus chỉ xin quyền <code>calendar.app.created</code>, nên nó chỉ truy cập được lịch do chính nó tạo &mdash; nó không thể xem, sửa hay xóa các lịch hoặc sự kiện khác của bạn. Bạn có thể hủy liên kết bất cứ lúc nào trong Settings của app.',
    'cal.read': 'Đọc <a href="privacy.html">Chính sách bảo mật</a> để biết đầy đủ chi tiết.',
    'c6.idx': '[06] &middot; mã nguồn',
    'c6.h': 'Mã nguồn công khai.<br><span class="soft">Cứ thoải mái đọc.</span>',
    'c6.sub': 'Code được công khai để đọc trên GitHub. Bảo lưu mọi quyền.',
    'git.cloning': 'đang clone vào \'focus-timer\'... xong.',
    'git.source': 'mã nguồn &#8599;',

    /* index: CTA + info */
    'cta.q': '&gt; thấy hay không?',
    'cta.h': 'Cài nó thôi.',
    'cta.btn': 'Mở hướng dẫn cài đặt &rarr;',
    'cta.bar': '// hướng dẫn cài đặt',
    'cta.min': '~10 phút',
    'cta.s1': 'Tải file IPA của Focus',
    'cta.s2': 'Cài iloader trên máy tính',
    'cta.s3': 'Đăng nhập &amp; cài vào iPhone',
    'cta.s4': 'Tin cậy app &amp; mở Focus',
    'cta.all': 'xem hướng dẫn đầy đủ từng bước &rarr;',
    'info.h': 'Cài đặt &amp; cập nhật',
    'info.p': 'Focus được cài bằng cách sideload với một Apple ID miễn phí. Làm theo <a href="install.html">hướng dẫn cài đặt từng bước</a> cho Windows hoặc Mac.',
    'info.latest': '<strong>Bản mới nhất:</strong> <a href="https://github.com/SuS1234trwtw/focus-timer/releases/latest">GitHub Releases</a>',
    'info.ss': '<strong>Nguồn SideStore:</strong> <code>https://github.com/SuS1234trwtw/focus-timer/releases/latest/download/source.json</code>',
    'info.contact': 'Liên hệ &amp; hỗ trợ',
    'info.ask': 'Câu hỏi, báo lỗi hoặc yêu cầu về dữ liệu:',
    'info.meta': 'Focus là một dự án độc lập, không liên kết, không được bảo trợ hay tài trợ bởi Google, Spotify hay Apple.',

    /* player (player.js) */
    'np.now': 'đang phát',
    'np.press': 'bấm play',
    'np.gen': 'tạo trực tiếp &middot; không bản quyền',
    'np.minor': 'thứ',
    'np.file': 'file của bạn &middot; chỉ phát trên thiết bị này',
    'np.up': 'tiếp theo',
    'np.title': '{noun} {adj}',
    'np.adj': 'dịu,muộn,lặng,neon,giấy,chậm,ấm,xanh,trầm,tĩnh,mờ,nhỏ',
    'np.noun': 'căn phòng,tín hiệu,quỹ đạo,con sóng,con phố,đèn lồng,ô cửa,giờ,nốt nhạc,mây,chuyến tàu,dòng sông',
    'np.s.lofi': 'lofi',
    'np.s.ambient': 'ambient',
    'np.s.synth': 'synth',
    'np.s.rain': 'mưa',
    'np.style': 'Phong cách',
    'np.tempo': 'nhịp',
    'np.tempolbl': 'Nhịp',
    'np.vol': 'âm lượng',
    'np.vollbl': 'Âm lượng',
    'np.own': '+ phát file của bạn',
    'np.prev': 'Bài trước',
    'np.next': 'Bài ngẫu nhiên tiếp theo',
    'np.play': 'Phát',
    'np.pause': 'Tạm dừng',

    /* install */
    'in.title': 'Cài Focus — hướng dẫn iloader & SideStore',
    'in.h1': 'Cài đặt Focus',
    'in.meta': 'Cập nhật 2 tháng 10, 2026 &middot; iPhone chạy iOS 26 trở lên &middot; Apple Account miễn phí',
    'in.before': 'Trước khi bắt đầu',
    'in.b1': 'Focus không có trên App Store. Bạn tự cài nó (&ldquo;sideload&rdquo;) bằng một Apple Account miễn phí.',
    'in.b2': 'Bản cài miễn phí hết hạn sau <strong>7 ngày</strong>. Cài lại bằng iloader, hoặc để SideStore tự làm mới giúp bạn.',
    'in.b3': 'iPhone cần đặt mật mã, và bạn cần một sợi cáp USB cho lần thiết lập đầu tiên.',
    'in.b4': 'Tải file IPA mới nhất của Focus: <a href="https://github.com/SuS1234trwtw/focus-timer/releases/latest">GitHub Releases &rarr; bản mới nhất</a> (file có tên <code>FocusTimer-&lt;version&gt;-&lt;build&gt;.ipa</code>).',
    'in.pick': 'Chọn cách cài',
    'in.method': 'Cách cài đặt',
    'in.pa.k': '[A] &middot; 10 bước',
    'in.pa.d': 'Đơn giản nhất. Cài từ PC; làm lại mỗi 7 ngày và mỗi lần có bản cập nhật.',
    'in.pb.k': '[B] &middot; 9 bước',
    'in.pb.d': 'Giống A, nhưng trên Mac. Không cần cài thêm gì.',
    'in.pc.k': '[C] &middot; 9 bước',
    'in.pc.d': 'Thiết lập lâu hơn chút ở lần đầu, sau đó cập nhật và làm mới ngay trên điện thoại.',
    'in.w.pc': 'trên pc',
    'in.w.mac': 'trên mac',
    'in.w.iloader': 'trong iloader',
    'in.w.iphone': 'trên iphone',
    'in.w.computer': 'trên máy tính',
    'in.w.sidestore': 'trong sidestore',
    'in.w.done': 'xong',
    'in.a.h': '[A] iloader trên Windows',
    'in.a1.h': 'Kiểm tra PC',
    'in.a1.p': 'iloader cần Windows 64-bit chạy chip Intel hoặc AMD (chưa hỗ trợ Windows on Arm).',
    'in.a2.h': 'Cài iTunes',
    'in.a2.p1': 'Để Windows nói chuyện được với iPhone: tải từ <a href="https://www.apple.com/itunes/download/win64">apple.com</a> (khuyên dùng) hoặc Microsoft Store. Mở nó một lần và kiểm tra xem nó đã nhận iPhone chưa.',
    'in.a2.p2': 'Nếu chưa nhận, gỡ iTunes và &ldquo;Apple Mobile Device Support&rdquo;, rồi cài app <strong>Apple Devices</strong> từ Microsoft Store thay thế.',
    'in.dl.h': 'Tải iloader',
    'in.a3.p': 'Chỉ tải từ <a href="https://github.com/nab138/iloader/releases">github.com/nab138/iloader/releases</a> hoặc <a href="https://iloader.app">iloader.app</a>. Chọn <code>iloader-windows-x64.msi</code> và chạy trình cài đặt.',
    'in.plug.h': 'Cắm iPhone vào',
    'in.a4.p': 'Mở khóa máy. Chạm <strong>Trust</strong> trên pop-up &ldquo;Trust This Computer?&rdquo; và nhập mật mã.',
    'in.sign.h': 'Đăng nhập',
    'in.sign.p1': 'Mở iloader. Ở bảng <strong>Apple ID</strong>, nhập email và mật khẩu Apple Account rồi bấm <strong>Login</strong>. Gõ mã 6 số hiện trên thiết bị Apple khác của bạn và bấm <strong>Submit</strong>.',
    'in.sign.p2': 'Dùng Apple Account khác với tài khoản trên điện thoại cũng được. Chưa hỗ trợ đăng nhập bằng khóa bảo mật.',
    'in.sel.h': 'Chọn iPhone của bạn',
    'in.sel.p': 'Chọn nó trong bảng <strong>iDevice</strong>. Không thấy? Bấm <strong>Refresh Devices</strong>.',
    'in.inst.h': 'Cài Focus',
    'in.inst.p1': 'Trong mục <strong>Installers</strong>, bấm <strong>Import IPA</strong> và chọn file <code>.ipa</code> Focus bạn đã tải. Chờ &ldquo;Sign &amp; Install App&rdquo; chạy xong.',
    'in.inst.p2': 'Nếu iloader báo &ldquo;Maximum certificates reached&rdquo;, cứ để nó thu hồi chứng chỉ cũ rồi bấm <strong>Continue</strong>.',
    'in.trust.h': 'Tin cậy nhà phát triển',
    'in.trust.p': 'Mở <strong>Settings &rarr; General &rarr; VPN &amp; Device Management</strong>, chạm vào Apple Account của bạn dưới &ldquo;Developer App&rdquo;, chạm <strong>Trust</strong> (rồi <strong>Allow &amp; Restart</strong> nếu được hỏi) và nhập mật mã.',
    'in.dev.h': 'Bật Developer Mode',
    'in.dev.p': 'Mở <strong>Settings &rarr; Privacy &amp; Security</strong>, cuộn xuống cuối, bật <strong>Developer Mode</strong> và chạm <strong>Restart</strong>. Sau khi máy khởi động lại, xác nhận bằng <strong>Turn On</strong> và nhập mật mã.',
    'in.open.h': 'Mở Focus',
    'in.open.p1': 'Bắt đầu một phiên tập trung để thấy đồng hồ chạy trên Dynamic Island.',
    'in.open.p2': 'Muốn cập nhật mà không cần máy tính? Thiết lập <a href="#sidestore" data-go="sidestore">SideStore</a>.',
    'in.back': '&larr; Lùi',
    'in.all': 'xem tất cả các bước',
    'in.next': 'Tiếp &rarr;',
    'in.one': 'từng bước một',
    'in.b.h': '[B] iloader trên Mac',
    'in.b1.p1': 'Không cần cài thêm gì &mdash; macOS đã có sẵn những gì cần để nói chuyện với iPhone.',
    'in.b1.p2': 'Tải iloader từ <a href="https://github.com/nab138/iloader/releases">github.com/nab138/iloader/releases</a> hoặc <a href="https://iloader.app">iloader.app</a>: chọn <code>iloader-darwin-universal.dmg</code> (chạy được trên cả Mac chip Apple silicon lẫn Intel). Mở file và kéo iloader vào Applications.',
    'in.b2.h': 'Cho phép mở app',
    'in.b2.p': 'Nếu macOS chặn, vào <strong>System Settings &rarr; Privacy &amp; Security</strong> và bấm <strong>Open Anyway</strong>.',
    'in.b3.p': 'Mở khóa máy và chạm <strong>Trust</strong> trên điện thoại (và trên Mac nếu được hỏi). Không thấy hỏi? Mở Finder, rồi rút ra cắm lại điện thoại.',
    'in.c.h': '[C] SideStore: cập nhật một chạm ngay trên điện thoại',
    'in.c1.h': 'Cài LocalDevVPN',
    'in.c1.p1': 'Tải từ <a href="https://apps.apple.com/app/localdevvpn/id6755608044">App Store</a>. Mở app, chạm connect và cho phép cấu hình VPN.',
    'in.c1.p2': 'SideStore cần nó (và Wi-Fi) được bật mỗi khi cài, cập nhật hoặc làm mới app.',
    'in.c2.h': 'Thiết lập iloader',
    'in.c2.p': 'Làm bước 1&ndash;6 của <a href="#iloader-windows" data-go="iloader-windows">cách A (Windows)</a> hoặc 1&ndash;5 của <a href="#iloader-mac" data-go="iloader-mac">cách B (Mac)</a>: cài iloader, cắm điện thoại, đăng nhập và chọn iPhone. Xong thì quay lại đây.',
    'in.c3.h': 'Cài SideStore',
    'in.c3.p': 'Trong mục <strong>Installers</strong>, chọn <strong>SideStore (Stable)</strong>. iloader sẽ tải SideStore, cài nó và đặt sẵn file ghép đôi (pairing file) cho bạn.',
    'in.c4.h': 'Tin cậy &amp; bật Developer Mode',
    'in.c4.p1': '<strong>Settings &rarr; General &rarr; VPN &amp; Device Management</strong>: chạm vào Apple Account của bạn, chạm <strong>Trust</strong>.',
    'in.c4.p2': '<strong>Settings &rarr; Privacy &amp; Security &rarr; Developer Mode</strong>: bật lên, khởi động lại, rồi xác nhận bằng <strong>Turn On</strong>.',
    'in.c5.h': 'Mở SideStore',
    'in.c5.p': 'Kết nối LocalDevVPN, mở <strong>SideStore</strong> và đăng nhập bằng đúng Apple Account đó.',
    'in.c6.h': 'Làm mới SideStore một lần',
    'in.c6.p': 'Vào <strong>My Apps</strong> và chạm nút <strong>7 DAYS</strong> cạnh SideStore (chạm <strong>Yes</strong> hoặc <strong>Refresh Now</strong> nếu được hỏi). SideStore có thể nhảy ra Màn hình chính &mdash; chuyện bình thường.',
    'in.c7.h': 'Thêm nguồn Focus',
    'in.c7.p1': 'Mở tab <strong>Sources</strong>, chạm <strong>+</strong>, dán URL này và chạm <strong>Done</strong>:',
    'in.c7.p3': 'Đã cài Focus rồi? Thay vào đó, mở Focus &rarr; Settings &rarr; updates &rarr; <strong>add to sidestore</strong>.',
    'in.c8.p': 'Mở nguồn Focus và cài nó. Khi SideStore hỏi về <strong>App Extensions</strong>, chọn <strong>Keep App Extensions (Register App ID for Each Extension)</strong> để Dynamic Island và widget vẫn hoạt động.',
    'in.c9.h': 'Vậy là xong',
    'in.c9.p': 'Từ giờ SideStore tự làm mới Focus trong nền và hiện nút <strong>Update</strong> khi có bản build mới.',
    'in.upd.h': 'Cập nhật Focus',
    'in.upd1': 'Focus tự kiểm tra bản build mới. Khi có, bạn sẽ thấy <code>&gt; update available</code> ở đầu app và trong <strong>Settings &rarr; updates</strong>.',
    'in.upd2': '<strong>iloader:</strong> tải IPA mới từ <a href="https://github.com/SuS1234trwtw/focus-timer/releases/latest">Releases</a> về máy tính, rồi dùng lại <strong>Import IPA</strong>. Cài đè lên bản cũ (đừng xóa trước) để giữ cài đặt trên máy; việc cần làm cũng đã được sao lưu nhờ đồng bộ.',
    'in.upd3': '<strong>SideStore:</strong> mở <strong>My Apps</strong> và chạm <strong>Update</strong> cạnh Focus.',
    'in.tr.h': 'Khắc phục sự cố',
    'in.t1.s': 'iloader không tìm thấy iPhone',
    'in.t1.b': 'Đảm bảo iTunes (hoặc Apple Devices) đã nhận máy, thử cáp hoặc cổng USB khác, mở khóa điện thoại và chạm Trust.',
    'in.t2.s': '&ldquo;Untrusted Developer&rdquo; khi mở Focus',
    'in.t2.b': 'Settings &rarr; General &rarr; VPN &amp; Device Management, chạm vào Apple Account của bạn rồi chạm <strong>Trust</strong>.',
    'in.t3.s': '&ldquo;Unable to Verify App&rdquo;',
    'in.t3.b': 'Kết nối internet, rồi trong VPN &amp; Device Management chạm vào Apple Account của bạn và chọn <strong>Verify App</strong>.',
    'in.t4.s': 'Focus không mở được sau một tuần',
    'in.t4.b': 'Chữ ký miễn phí 7 ngày đã hết hạn. Cài lại bằng iloader, hoặc làm mới trong SideStore.',
    'in.t5.s': '&ldquo;Maximum number of apps&rdquo; / không đủ App ID',
    'in.t5.b': 'Tài khoản miễn phí chỉ có 3 app sideload hoạt động cùng lúc (SideStore tính là một; app hết hạn vẫn bị tính) và đăng ký được 10 App ID mỗi 7 ngày. Gỡ app bạn không dùng, hoặc chờ App ID cũ hết hạn.',
    'in.t6.s': 'Không có đồng hồ trên Dynamic Island / không có widget',
    'in.t6.b': 'Extension widget chưa được ký. Cài lại bằng iloader, hoặc trong SideStore chọn &ldquo;Register App ID for Each Extension&rdquo;. Focus &rarr; Settings &rarr; island cho biết extension đã được ký hay chưa.',
    'in.t7.s': 'SideStore báo lỗi về VPN, Wi-Fi hoặc file ghép đôi',
    'in.t7.b': 'Bật Wi-Fi và LocalDevVPN, tắt DNS hoặc trình chặn quảng cáo, rồi khởi động lại SideStore. Vẫn lỗi? Trong iloader bấm <strong>Delete Stored Pairing</strong>, chọn lại điện thoại và chạm Trust, rồi bấm <strong>Manage Pairing File &rarr; Place</strong> cạnh SideStore. Xem <a href="https://docs.sidestore.io/docs/troubleshooting/error-codes">mã lỗi SideStore</a>.',
    'in.help': 'Cần giúp đỡ?',
    'in.foot': 'iloader và SideStore là các dự án mã nguồn mở độc lập, không liên kết với Focus hay Apple.',
    'in.step': 'bước {n} / {m}',
    'in.stepbtn': 'Bước {n}',
    'in.steps': '{n} bước',
    'in.copy': 'chép',
    'in.copied': 'đã chép',

    /* confirmed */
    'cf.title': 'Đã xác nhận email — Focus',
    'cf.log': '$ focus tài-khoản --xác-nhận\n  xác minh email .......... <span class="ok">[ ổn ]</span>',
    'cf.h': 'Đã xác nhận email',
    'cf.lead': 'Quay lại Focus để hoàn tất thiết lập sao lưu &amp; đồng bộ. App sẽ tự nhận; nếu không, mở Settings &rarr; account và chạm <strong>i confirmed it</strong>.',
    'cf.open': 'Mở Focus &rarr;',
    'cf.web': 'Trang web',
    'cf.close': 'Mở app xong thì bạn có thể đóng tab này.',
    'cf.fail.log': '$ focus tài-khoản --xác-nhận\n  xác minh email .......... <span class="err">[ lỗi ]</span>',
    'cf.fail.h': 'Link không dùng được',
    'cf.expired': 'Link xác nhận này đã hết hạn hoặc đã được dùng. Nếu bạn đã bấm nó một lần, email của bạn đã được xác nhận: quay lại Focus và chạm “i confirmed it”. Nếu không, tạo lại tài khoản trong app để nhận link mới.',
    'cf.retry': '{error}. Quay lại Focus và thử lại.'
  };

  var root = document.documentElement;
  var lang = null;
  try { lang = localStorage.getItem('lang'); } catch (e) {}
  if (lang !== 'en' && lang !== 'vi') lang = /^vi/i.test(navigator.language || '') ? 'vi' : 'en';

  function T(key, en) { return lang === 'vi' && VI.hasOwnProperty(key) ? VI[key] : en; }

  function all(sel) { return [].slice.call(document.querySelectorAll(sel)); }
  function apply() {
    // pages without tagged text (privacy, terms) stay English: only the switch remembers the choice
    if (document.querySelector('[data-i18n]')) root.lang = lang;
    all('[data-i18n]').forEach(function (el) {
      if (el._en == null) el._en = el.innerHTML; // the English original, read from the page once
      el.innerHTML = T(el.getAttribute('data-i18n'), el._en);
    });
    all('[data-i18n-attr]').forEach(function (el) {
      el._enAttr = el._enAttr || {};
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), name = p[0].trim(), key = (p[1] || '').trim();
        if (!(name in el._enAttr)) el._enAttr[name] = el.getAttribute(name) || '';
        el.setAttribute(name, T(key, el._enAttr[name]));
      });
    });
    all('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    apply();
    document.dispatchEvent(new Event('langchange'));
  }

  T.lang = function () { return lang; };
  T.set = setLang;
  window.T = T;

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (b) setLang(b.getAttribute('data-lang'));
  });
  // apply as soon as the page is parsed, before deferred scripts and first paint where possible
  if (document.readyState !== 'loading') apply();
  else document.addEventListener('readystatechange', function once() { document.removeEventListener('readystatechange', once); apply(); });
})();
