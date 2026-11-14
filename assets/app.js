/* ==========================================================================
   SNAM Quality — Application
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pair = (a, b) => `<span dir="ltr" style="unicode-bidi:isolate">${a} / ${b}</span>`;
  const num = n => (n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 }));
  const pad = n => String(n).padStart(2, '0');
  const clockNow = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const approvalDateOf = a => {
    const d = (a && (a.sealedAt || a.approvedAt || a.finalAt)) || '';
    return (a && (a.approval === 'approved' || d)) ? (d ? fmtDate(d) : '—') : '—';
  };
  const visitTimeOf = a => {
    if (!a) return '—';
    if (a.visitTime) return a.visitTime;
    const src = a.createdAt || a.updatedAt;
    if (typeof src === 'string' && src.includes('T')) {
      const d = new Date(src); if (!isNaN(d)) return pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    return '—';
  };
  const APP_VERSION = 'v170';
  const BUILD_DATE = '2026-11-07';
  const CHANGELOG = [
    { v: 'v82', date: '2026-11-07', items: ['ضبط مقاسات الصفحة على الجوال — بدون حاجة للتصغير', 'منع التمرير الأفقي وتحسين بطاقات الإحصائيات للشاشات الصغيرة'] },
    { v: 'v170', date: '2026-11-14', items: ['ترتيب القائمة: زيارات الجرد داخل الزيارات، ونظام الجرد تحته، وحذف مجموعة الجرد المكررة'] },
    { v: 'v169', date: '2026-11-14', items: ['نسخ احتياطية سحابية تلقائية يوميًا (30 نسخة) مع تنزيل واستعادة من الإعدادات'] },
    { v: 'v168', date: '2026-11-14', items: ['أداة استعادة الزيارات المحذوفة من نسخ الجهاز (IndexedDB)'] },
    { v: 'v167', date: '2026-11-14', items: ['إرجاع «زيارات الجرد» إلى قائمة الزيارات الرقابية'] },
    { v: 'v166', date: '2026-11-14', items: ['إصلاح شعار الشركة في الطباعة (كان يختفي بفلتر grayscale) وروابط الشعار في تقارير HR'] },
    { v: 'v165', date: '2026-11-14', items: ['قسم الجرد مستقل في القائمة مع قائمة فرعية ورابط مستقل inv.html'] },
    { v: 'v164', date: '2026-11-14', items: ['نظام جرد متكامل: جرد يومي ونصف سنوي وسنوي ومفاجئ + أصناف وأسعار وحساب الفروق وقيمة الفاقد وتقارير مطبوعة'] },
    { v: 'v163', date: '2026-11-14', items: ['استثناء حسابات من إغلاق الصيانة (الموارد البشرية والأدمن) مع إدارة القائمة من الإعدادات'] },
    { v: 'v162', date: '2026-11-14', items: ['طباعة كل تقارير الموارد البشرية (موظفون، حضور، طلبات، مسير رواتب، مكافآت، لائحة، بطاقة موظف)'] },
    { v: 'v161', date: '2026-11-14', items: ['إخفاء شريط التنقل السفلي عن بوابة الموظف'] },
    { v: 'v160', date: '2026-11-14', items: ['بوابة الموظف من جواله: حضور بالوجه داخل نطاق الفرع، ورفض التسجيل خارج الموقع أو بوجه غير مطابق'] },
    { v: 'v159', date: '2026-11-14', items: ['لائحة عمل داخلية مع الإقرار الإلكتروني', 'مكافآت المتميزين من تقييمات الفروع', 'خصم جودة في مسير الرواتب', 'رابط مستقل للموارد البشرية hr.html'] },
    { v: 'v158', date: '2026-11-14', items: ['وحدة الموارد البشرية: موظفون، حضور بالبصمة والموقع، طلبات وإجازات، رواتب وخصومات وقسائم'] },
    { v: 'v157', date: '2026-11-13', items: ['حد لمرات فتح الباركود (افتراضي 10) + زر ضبط الحد وتصفير العدّاد'] },
    { v: 'v156', date: '2026-11-13', items: ['الباركود يفتح التقرير للعامة بدون تسجيل دخول (قراءة فقط)'] },
    { v: 'v155', date: '2026-11-13', items: ['بيانات التقرير: تاريخ الزيارة + وقت الزيارة + تاريخ الاعتماد'] },
    { v: 'v154', date: '2026-11-13', items: ['وقت الزيارة يظهر في الملحق المصور أيضًا'] },
    { v: 'v153', date: '2026-11-13', items: ['التقارير: «وقت الزيارة» بدل وقت الإصدار/الاعتماد — يُسجَّل عند حفظ الزيارة'] },
    { v: 'v152', date: '2026-11-12', items: ['الدرجة الافتراضية لكل بند = درجته القصوى (5 في تقييم المدراء، 4 في الفروع)'] },
    { v: 'v151', date: '2026-11-12', items: ['الملاحظات: إرفاق ملف PDF كإثبات تصحيح (ويُقبل للإغلاق بدل الصورة)'] },
    { v: 'v150', date: '2026-11-12', items: ['صور الملاحظات: زرّان منفصلان — كاميرا + اختيار من معرض الجوال'] },
    { v: 'v149', date: '2026-11-12', items: ['الملاحظات: إضافة صور التصحيح قبل الإغلاق (إلزامية للإغلاق)'] },
    { v: 'v148', date: '2026-11-12', items: ['أسماء القائمة: زيارات الفروع · زيارات تقييم مدراء الفروع · زيارات الجرد'] },
    { v: 'v147', date: '2026-11-12', items: ['استمارة مدير الفرع: 30 بندًا × 5 = 150', 'استمارة الجرد: 33 بندًا × 4 = 132'] },
    { v: 'v146', date: '2026-11-12', items: ['زر «حفظ الاستمارة» + تعديل/إيقاف/حذف البنود في الاستمارات الثلاث لمدراء الجودة والتشغيل'] },
    { v: 'v145', date: '2026-11-12', items: ['إصلاح الدخول من الأجهزة الجديدة (تحويل الاسم عبر السيرفر)', 'تعديل/إيقاف/حذف بنود الاستمارات متاح لمدير الجودة والتشغيل', 'نافذة تعديل داخلية تعمل على الجوال'] },
    { v: 'v144', date: '2026-11-11', items: ['إصلاح رفض حفظ الزيارات لمدراء الجودة/التشغيل (كان خطأ في التحقق من الصلاحيات)'] },
    { v: 'v143', date: '2026-11-11', items: ['ضغط الصور أقوى (780px/45%) + منع تكرار الصور عبر بصمة الملف'] },
    { v: 'v142', date: '2026-11-11', items: ['ملفي: بطاقة بيانات الهوية (الرقم/الإقامة، الإصدار، الانتهاء، الجنسية) يعدّلها المستخدم بنفسه'] },
    { v: 'v141', date: '2026-11-11', items: ['تنظيف تلقائي نهائي لتقارير الجرد والمدراء التجريبية من كل الأجهزة'] },
    { v: 'v140', date: '2026-11-11', items: ['الختم: «المنطقة الجنوبية» فقط وبخط أكبر بدون سطر مدير الجودة'] },
    { v: 'v139', date: '2026-11-11', items: ['نص الختم: «المنطقة الجنوبية»'] },
    { v: 'v138', date: '2026-11-11', items: ['الختم على تقارير الجرد والمدراء', 'نص الختم صار «المنطقة الجنوبية» بدل اسم المدير', 'حذف التقارير التجريبية'] },
    { v: 'v137', date: '2026-11-11', items: ['كلمات مرور عشوائية لكل الحسابات + المدير يقدر يعيّن كلمة مرور أي مستخدم من لوحة التحكم'] },
    { v: 'v136', date: '2026-11-11', items: ['أمان: عزل القراءة بالمنطقة — كل مستخدم يرى بيانات منطقته فقط عبر دالة محمية'] },
    { v: 'v135', date: '2026-11-11', items: ['لوحة «المتواجدون الآن»: قائمة منسدلة بالمناطق تعرض المتصلين لحظيًا (للمدير ومدير المنطقة والتشغيل)'] },
    { v: 'v134', date: '2026-11-11', items: ['زيارة الجرد: يكتبها مدير الجودة أو مدير التشغيل بالمنطقة (كل المناطق) + اسم الكاتب في التقرير والتوقيع'] },
    { v: 'v133', date: '2026-11-11', items: ['زيارة الجرد: المنطقة والمدينة والفرع تلقائيًا + تعبئة المسؤول ومدير الفرع + صورة/PDF/ملاحظة/مايك لكل بند'] },
    { v: 'v132', date: '2026-11-11', items: ['أمان: الحفظ صار عبر دالة محمية على السيرفر (منع تعديل المستخدمين/الإعدادات/الفروع لغير المدير، ومنع تعديل زيارات خارج منطقتك)'] },
    { v: 'v131', date: '2026-11-11', items: ['زيارات الجرد لا تظهر في قائمة الزيارات الرقابية ولا في الإحصاءات'] },
    { v: 'v130', date: '2026-11-11', items: ['إصلاح صفحة تحليل التقارير (كانت تتعطل)', 'تصدير Word/PDF لتقرير الجرد', 'إزالة تكرار عناصر القائمة'] },
    { v: 'v129', date: '2026-11-11', items: ['تقرير الجرد بنفس قالب تقرير الفروع + 4 توقيعات + زيارة مفاجأة + فلتر من/إلى تاريخ'] },
    { v: 'v128', date: '2026-11-11', items: ['زيارة الجرد: صفحة مستقلة + استمارة بدون درجات + حقول قابلة للإضافة والتعديل'] },
    { v: 'v127', date: '2026-11-11', items: ['إيقاف مؤقت ثم استئناف من نفس الخطوة + شريط «زيارة محفوظة» واضح'] },
    { v: 'v126', date: '2026-11-11', items: ['مؤشرات ورسوم لتقييم مدراء الفروع في لوحة المؤشرات', 'المسودات تُحفظ في السحابة: تفتح من أي جهاز'] },
    { v: 'v125', date: '2026-11-10', items: ['استمارة مدير الفرع: تعديل/إضافة/حذف البنود والمحاور مع تشغيل وإيقاف وتأكيد الحذف'] },
    { v: 'v124', date: '2026-11-10', items: ['إصلاح علوق النسخة القديمة: كل ملفات التطبيق تُحمّل برقم النسخة (تحديث يصل فورًا)'] },
    { v: 'v123', date: '2026-11-10', items: ['تحديث تلقائي: إذا نسخة الجهاز قديمة تُنظَّف الكاش وتُعاد التحميل'] },
    { v: 'v122', date: '2026-11-10', items: ['إحصاءات الفروع لا تحسب تقييمات المدراء', 'حذف تقييمات الاختبار تلقائيًا من الأجهزة', 'توحيد لون عناصر القائمة الفرعية'] },
    { v: 'v121', date: '2026-11-10', items: ['استمارتان مستقلتان: تقييم الفروع #/form وتقييم مدير الفرع #/form-bm (30 بندًا · 150 درجة)'] },
    { v: 'v120', date: '2026-11-10', items: ['فصل تام: صفحة زيارات الفروع لا تعرض تقييمات المدراء والعكس', 'تمييز «زيارة الفروع» بالأحمر في القائمة الفرعية'] },
    { v: 'v119', date: '2026-11-10', items: ['تقييم مدير الفرع: أزرار الجوال صارت صفّين ولا تنقطع', 'ملخص الفترة: الشهري يجمع الأسابيع والسنوي يجمع الأشهر مع المعدل'] },
    { v: 'v118', date: '2026-11-10', items: ['صفحة مستقلة «زيارات مدراء الفروع» #/bmvisits مع فلتر وتصدير Word/PDF وطباعة'] },
    { v: 'v117', date: '2026-11-10', items: ['قائمة منسدلة تحت «الزيارات الرقابية»: زيارة الفروع / زيارة مدراء الفروع'] },
    { v: 'v116', date: '2026-11-10', items: ['نوع زيارة جديد: تقييم مدير الفرع (أسبوعي/شهري/سنوي) بـ30 بندًا من 150 درجة', 'تبويب «مدير الفرع» في الزيارات + المعدل العام للزيارات'] },
    { v: 'v115', date: '2026-11-10', items: ['تغيير كلمة المرور من السحابة', 'نقل الصور إلى تخزين Supabase (حجم البيانات 53KB بدل 2.4MB)'] },
    { v: 'v114', date: '2026-11-10', items: ['منع تجاوز كلمة المرور محليًا: الرفض يأتي من السحابة'] },
    { v: 'v113', date: '2026-11-10', items: ['ربط الدخول والبيانات بقاعدة Supabase سحابية (تحقق حقيقي من المستخدم)'] },
    { v: 'v112', date: '2026-11-10', items: ['توقيعات التقرير الشهري/السنوي: 4 خانات — بعد ياسر «مدير التشغيل بشركة سنام» ثم المدير التنفيذي'] },
    { v: 'v111', date: '2026-11-10', items: ['الرابط يتغير مع كل صفحة ويبقى عليها بعد التحديث (بدل الرجوع للرئيسية)'] },
    { v: 'v110', date: '2026-11-10', items: ['توقيعات التقرير في صف واحد (4 خانات) ورفعها حتى لا تنقسم بين الصفحات'] },
    { v: 'v109', date: '2026-11-10', items: ['دور جديد: مدير فرع + حساب branch (كلمة المرور Snam@2026)', 'تعديل دور أي مستخدم من صفحة المستخدمين (admin/الفزعة)'] },
    { v: 'v108', date: '2026-11-10', items: ['حقل «اسم المدير التنفيذي» في الإعدادات ويظهر في خانة توقيعه'] },
    { v: 'v107', date: '2026-11-10', items: ['خانة توقيع المدير التنفيذي تعرض اسمه الصحيح بدل اسم مدير التشغيل'] },
    { v: 'v106', date: '2026-11-10', items: ['كل الروابط تفتح صفحتها بعد تسجيل الدخول بدل الصفحة الرئيسية', 'زر «تحميل PDF» لتقرير الزيارة'] },
    { v: 'v105', date: '2026-11-10', items: ['الباركود يفتح تقرير الزيارة مباشرة بعد تسجيل الدخول، ومخصص لمدير الجودة ومدير التشغيل والإدارة'] },
    { v: 'v104', date: '2026-11-10', items: ['تحليل التقارير: متابعة الملاحظات السابقة وهل تمت معالجتها + كتابة سبب عدم المتابعة وطباعته'] },
    { v: 'v103', date: '2026-11-10', items: ['إصلاح شريط العد التنازلي (كان يظهر Infinity/NaN عند عدم وجود وقت بداية)'] },
    { v: 'v102', date: '2026-11-10', items: ['قسم «ملفي»: تقييم شخصي لمدير الجودة من 100 مع زياراته ودرجاته ومتابعة ملاحظاته'] },
    { v: 'v101', date: '2026-11-10', items: ['زر العين لكلمة المرور ثابت وواضح ولا يختفي أثناء الكتابة'] },
    { v: 'v100', date: '2026-11-10', items: ['طباعة التحليل: ترويسة كتقرير الزيارة، طولي، توقيعات، خطة علاجية بالمدة والتنفيذ', 'اعتماد التحليل من مدير الجودة'] },
    { v: 'v99', date: '2026-11-10', items: ['طباعة التحليل صارت لوحة مؤشرات مخصصة: أعمدة ومقارنات وجداول مرتبة'] },
    { v: 'v98', date: '2026-11-10', items: ['ترتيب بطاقات التحليل في الطباعة بعرض كامل ورسوم بارتفاع ثابت'] },
    { v: 'v97', date: '2026-11-10', items: ['تصغير دائرة المخالفات في الطباعة لإزالة الفراغ'] },
    { v: 'v96', date: '2026-11-10', items: ['تحسين شكل بطاقات المؤشرات في طباعة التحليل'] },
    { v: 'v95', date: '2026-11-10', items: ['ضبط مقاسات بطاقات المؤشرات والرسوم في طباعة التحليل'] },
    { v: 'v94', date: '2026-11-10', items: ['تحليل التقارير عند الطباعة: لوحة مؤشرات أفقية A4 بأعمدة ورسوم وترتيب منظم'] },
    { v: 'v93', date: '2026-11-10', items: ['تقييم مدير المنطقة KPI من 100: الزيارات، إغلاق الملاحظات، التغطية، التحسن، الالتزام بالمواعيد — غير مقبول/جيد/جيد جدًا/متميز'] },
    { v: 'v92', date: '2026-11-10', items: ['المدينة الافتراضية لكل منطقة عند إنشاء زيارة', 'مدير الجودة يرى منطقته فقط ويضيف فروعًا؛ تعديل المدينة/الفرع للأدمن', 'قسم «تحليل التقارير»: ترتيب الفروع، القوة والضعف، المخالفات، المقارنة، التكرار، خطة تصحيحية وتوصيات'] },
    { v: 'v91', date: '2026-11-10', items: ['شاشة الصيانة صارت صورة إعلان في منتصف الشاشة بإطار أبيض بدون زر إغلاق'] },
    { v: 'v90', date: '2026-11-10', items: ['شريط العد التنازلي يظهر بمجرد جدولة التحديث (أيام/ساعات/دقائق) ويتحول للون التحذيري آخر 10 دقائق'] },
    { v: 'v89', date: '2026-11-10', items: ['صلاحيات التقرير: تعديل/حذف لمدير الجودة الذي أنشأه فقط', 'الاعتماد النهائي والختم عند مدير التشغيل بالمنطقة', 'التوقيعات: إضافة مدير التشغيل بشركة سنام والمدير التنفيذي', 'المدن: تعديل وإيقاف/تفعيل وحذف', 'إدارة المساحة وضغط الصور'] },
    { v: 'v88', date: '2026-11-10', items: ['زر «إيقاف مؤقت» أثناء الزيارة (للصلاة أو أي توقف) مع استئناف من نفس المكان', 'حفظ تلقائي للزيارة أثناء الكتابة'] },
    { v: 'v87', date: '2026-11-10', items: ['خيار «احفظني على هذا الجهاز» — لا يطلب كلمة المرور بعد كل تحديث', 'زر العين لإظهار كلمة المرور في شاشة الدخول'] },
    { v: 'v86', date: '2026-11-10', items: ['وضع التحديثات مع مهلة 10 دقائق وعدّاد وشاشة صيانة بالصورة', 'المناطق والمدن قائمة انزلاقية والجنوبية أولًا', 'صلاحيات المستخدمين والإعدادات لمدير لوحة التحكم', 'استرجاع التوقيعات المفقودة'] },
    { v: 'v85', date: '2026-11-10', items: ['سجل التحديثات لمدير لوحة التحكم فقط', 'بطاقة النسخة أول عنصر في الإعدادات'] },
    { v: 'v84', date: '2026-11-10', items: ['استرجاع تلقائي للتوقيعات المفقودة في التقارير المعتمدة'] },
    { v: 'v83', date: '2026-11-10', items: ['صفحة المستخدمين وإعدادات الموقع لمدير لوحة التحكم فقط', 'حساب احتياطي محمي (الفزعه)', 'ترتيب التوقيعات: مدير الفرع ثم مدير التشغيل بشركة سنام', 'وضع التحديثات: مهلة 10 دقائق + عدّاد + شاشة صيانة بالصورة', 'إدارة المساحة وضغط الصور على الجوال', 'حفظ تلقائي للمسودة واستئنافها'] },
    { v: 'v81', date: '2026-11-07', items: ['رفع شارة «نظام الجودة» قليلًا وتكبيرها'] },
    { v: 'v80', date: '2026-11-07', items: ['حذف زر «موقع الشركة» من البانر', 'نقل شارة «نظام الجودة» أسفل يسار البانر'] },
    { v: 'v79', date: '2026-11-07', items: ['باركود التقارير صار يستخدم رابط الموقع الحالي تلقائيًا (يعمل مع أي دومين)'] },
    { v: 'v78', date: '2026-11-07', items: ['حذف الزيارة اليومية والفصلية من قائمة الزيارات واختيار نوع الزيارة'] },
    { v: 'v77', date: '2026-11-07', items: ['مؤشرات الفروع في لوحة المؤشرات: تمت زيارتها / لم تُزر / متميزة / تحتاج تكثيف', 'لافتة «فروع تحتاج المتابعة المكثفة» تفتح قائمة الأسماء بالدرجات'] },
    { v: 'v76', date: '2026-11-07', items: ['الزيارة المفاجأة صارت خيارًا داخل الزيارة الأسبوعية/الشهرية/السنوية', 'عنوان التقرير: «تقرير زيارة أسبوعية مفاجأة» مثلًا', 'فلتر «مفاجأة» في قسم الزيارات'] },
    { v: 'v75', date: '2026-11-07', items: ['نوع زيارة جديد: زيارة رقابية مفاجأة — نفس البنود والاعتماد والصور والختم', 'تقريرها يظهر بعنوان «تقرير زيارة رقابية مفاجأة»'] },
    { v: 'v74', date: '2026-11-07', items: ['نقل الإعلان فوق الإحصائيات في الصفحة الرئيسية', 'إطار ذهبي أنيق للإعلان مع شارة «إعلان»'] },
    { v: 'v73', date: '2026-11-07', items: ['إضافة رابط لكل إعلان (تيك توك/يوتيوب/إنستغرام) يفتح عند الضغط على الإعلان'] },
    { v: 'v72', date: '2026-11-07', items: ['قسم «الإعلانات» مستقل في القائمة بعد المستخدمين وقبل الإعدادات', 'عرض/تعديل/حذف الإعلانات مع حالة كل إعلان'] },
    { v: 'v71', date: '2026-11-07', items: ['إعلانات بالعرض: صورة + نص حتى ١٠٠٠ حرف مع جدولة وقت البداية والنهاية', 'عنوان «الزيارات للمناطق والفروع» فوق القسمين', 'تبديل تلقائي كل ١٠ ثوانٍ للإعلانات وبطاقات الزيارات', 'تمديد الصفحة الرئيسية لعرض كامل على الآيباد والكمبيوتر'] },
    { v: 'v70', date: '2026-11-07', items: ['سجل التحديثات — اضغط رقم النسخة لعرض كل نسخة وأهم ما فيها'] },
    { v: 'v69', date: '2026-11-07', items: ['عرض رقم النسخة والتاريخ في الإعدادات وأسفل الصفحة الرئيسية', 'زر «تحديث الكاش» لمسح النسخة القديمة فورًا'] },
    { v: 'v68', date: '2026-11-07', items: ['رابط الموقع الرئيسي يفتح الصفحة الرئيسية دائمًا حتى مع تسجيل الدخول'] },
    { v: 'v67', date: '2026-11-07', items: ['إضافة «الصفحة الرئيسية» أول عنصر في القائمة الجانبية'] },
    { v: 'v66', date: '2026-11-07', items: ['حساب admin يعمل بنفس صلاحيات مدير الجودة (إنشاء/تعديل/إرسال/ختم)'] },
    { v: 'v65', date: '2026-11-07', items: ['صفحة رئيسية عامة: عدد فروع الجنوبية والمدن والزيارات وأعلى ٥ فروع', 'قسم زيارات المشرف العام والمدير التنفيذي بصور ومقالات', 'نص الحقوق ورابط الشركة المالكة قابل للتعديل من الإعدادات'] },
    { v: 'v64', date: '2026-11-07', items: ['تصدير التقرير والملحق المصور إلى Word'] },
    { v: 'v63', date: '2026-11-07', items: ['حذف قائمة المدققين الجاهزة — الكتابة يدويًا', 'تصحيح اسم المدقق في الزيارات القديمة إلى بندر مروعي'] },
    { v: 'v62', date: '2026-11-07', items: ['مسار اعتماد: بندر → ياسر (مدير المنطقة) → المدير التنفيذي', 'إعادة التقرير بسبب مكتوب', 'توقيع إلكتروني لكل مستخدم يظهر تحت اسمه'] },
    { v: 'v61', date: '2026-11-07', items: ['إصلاح شعار الختم داخل التقارير'] },
    { v: 'v60', date: '2026-11-07', items: ['تقارير أسبوعي/شهري/سنوي + فلترة المنطقة والمدينة والفرع', 'بند «إضافة صور أخرى» بدون درجة (حتى ٥ صور للبند)'] },
    { v: 'v59', date: '2026-11-07', items: ['إصلاح عدم حفظ الزيارات الرقابية', 'دمج بيانات الجهاز مع السحابة بدل استبدالها'] }
  ];
  const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const MONTHS_SHORT = ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'];
  const NOW = new Date();
  const TODAY = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
  const TODAY_ISO = () => `${TODAY.getFullYear()}-${pad(TODAY.getMonth() + 1)}-${pad(TODAY.getDate())}`;
  const TOTAL_POINTS = (window.SNAM && window.SNAM.TOTAL_POINTS) || 100;

  function fmtDate(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr + 'T00:00:00');
    if (isNaN(d)) return isoStr;
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
  function fmtShort(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
  }
  function addDaysISO(isoStr, n) {
    const d = new Date(isoStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const ICONS = {
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    eye: '<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    store: '<path d="M4 10v10h16V10"/><path d="M3 4h18l-1.5 6a3 3 0 01-5.5 0 3 3 0 01-5.5 0A3 3 0 013 10L4.5 4z"/>',
    alert: '<path d="M12 3l9 16H3l9-16z"/><path d="M12 9v5M12 17h.01"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2V5z"/><path d="M8 7h7M8 11h7"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.56V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1.11-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.56-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.56-1.11 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.56V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.56 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.56 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.56 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/>',
    bell: '<path d="M18 15V10a6 6 0 10-12 0v5l-1.5 2.5h15L18 15Z"/><path d="M10 19a2 2 0 004 0"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    print: '<path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="7" rx="1"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
    sparkles: '<path d="M12 3l1.8 4.9L19 9.7l-4.2 3.4L16 18l-4-2.6L8 18l1.2-4.9L5 9.7l5.2-1.8L12 3z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 5.5a3.2 3.2 0 010 5.6M18 14.6a6.4 6.4 0 013.5 5.4"/>',
    clipboard: '<rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h4"/>',
    file: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"/><path d="M14 3v6h6"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/>',
    phone: '<path d="M5 3h3l2 5-2.5 1.5a12 12 0 006 6L15 13l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2 2 2 0 015 3z"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 17v3h16v-3"/>',
    edit: '<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    thumbUp: '<path d="M7 20V9l4-6c1.5 0 2 1 2 2.5V9h5a2 2 0 012 2.4l-1.4 6A2 2 0 0116.6 20H7z"/><path d="M3 9h4v11H3z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M8 21h8"/>',
    thumbDown: '<path d="M17 4v11l-4 6c-1.5 0-2-1-2-2.5V15H6a2 2 0 01-2-2.4l1.4-6A2 2 0 017.4 4H17z"/><path d="M21 15h-4V4h4z"/>'
  };
  function icon(name, size = 20) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  }

  /* ---------------- store ---------------- */
  const DEMO_MODE = sessionStorage.getItem('snam_demo') === '1';
  const DBKEY = DEMO_MODE ? window.SNAM.DB_KEY + '_demo' : window.SNAM.DB_KEY;

  function loadDb() {
    try {
      const raw = localStorage.getItem(DBKEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && p.sections && p.branches && p.audits) return p;
      }
    } catch (e) { console.warn(e); }
    return window.SNAM.SEED();
  }
  let db = loadDb();
  const DEF_SETTINGS = {
    qualityManagerName: 'بندر بن مروعي محمد',
    qualityManagerTitle: 'مدير الجودة — المنطقة الجنوبية',
    supervisorName: 'المشرف العام لشركة سنام',
    opsCompanyManagerName: 'محمد أحمد محمد',
    ceoName: '',
    maintenance: { enabled: false, start: '', end: '', msg: 'نظام الجودة تحت التحديثات — نعود إليكم قريبًا' }
  };
  const ADMIN_PASS_HASH = '612521dcc2df984f4430fbe1eb97c9585b48b791f4ea6f5c707c6687cd0213f4'; // Koad@282312
  const DEFAULT_PASS_HASH = '971da62f4359b52cbdbeb0f3d82203be234e0dc82349f7192ccb491ff74dbf62'; // Snam@2026
  const WORKFLOW_USERS = [
    { id: 'u18', name: 'مدير المنطقة الجنوبية', username: 'south', role: 'regional_manager', regionId: 'r-south', active: true, pass: DEFAULT_PASS_HASH },
    { id: 'u19', name: 'مدير المنطقة الشمالية', username: 'north', role: 'regional_manager', regionId: 'r-north', active: true, pass: DEFAULT_PASS_HASH }
  ];
  function ensureSettings() {
    if (!db.settings) db.settings = {};
    Object.keys(DEF_SETTINGS).forEach(k => { if (!db.settings[k]) db.settings[k] = DEF_SETTINGS[k]; });
    if (!db.visitTypes) db.visitTypes = {};
    if (!db.visitTypes.daily) db.visitTypes.daily = { key: 'daily', name: 'يومية', short: 'يومي', perYear: 0, cycleMonths: 0, color: '#3E7C59' };
    if (!db.visitTypes.bm_weekly) db.visitTypes.bm_weekly = { key: 'bm_weekly', name: 'أسبوعية', short: 'أسبوعي', perYear: 52, cycleMonths: 0, color: '#7A5C2E', bm: true };
    if (!db.visitTypes.bm_monthly) db.visitTypes.bm_monthly = { key: 'bm_monthly', name: 'شهرية', short: 'شهري', perYear: 12, cycleMonths: 1, color: '#7A5C2E', bm: true };
    if (!db.visitTypes.bm_yearly) db.visitTypes.bm_yearly = { key: 'bm_yearly', name: 'سنوية', short: 'سنوي', perYear: 1, cycleMonths: 12, color: '#7A5C2E', bm: true };
    if (!db.visitTypes.inventory) db.visitTypes.inventory = { key: 'inventory', name: 'جرد', short: 'جرد', perYear: 0, cycleMonths: 0, color: '#4A5B7A' };
    if (!db.drafts) db.drafts = {};
    invData();
    hrData();
    if (!db.invSections || !db.invSections.length) db.invSections = JSON.parse(JSON.stringify((window.SNAM.INV_SECTIONS) || []));
    if (!db.bmSections || !db.bmSections.length) db.bmSections = JSON.parse(JSON.stringify((window.SNAM.BM_SECTIONS) || []));
    if (!db.settings.invBmPurge) {
      db.audits = (db.audits || []).filter(a => a.kind !== 'inv' && a.kind !== 'bm');
      const ids = new Set((db.audits || []).map(a => a.id));
      db.findings = (db.findings || []).filter(f => ids.has(f.auditId));
      db.settings.invBmPurge = true;
    }
    if (!db.settings.bmTestPurge) {
      const bad = ['AU-0003', 'AU-0004'];
      db.audits = (db.audits || []).filter(a => !(a.kind === 'bm' && bad.includes(a.id)));
      db.findings = (db.findings || []).filter(f => !bad.includes(f.auditId));
      db.settings.bmTestPurge = true;
    }
    if (!db.settings.surpriseFix) {
      (db.audits || []).forEach(a => { if (a.type === 'surprise') { a.type = 'monthly'; a.surprise = true; } });
      db.settings.surpriseFix = true;
    }
    /* ترحيل: حساب admin بكلمة المرور المطلوبة مرة واحدة */
    /* توحيد الصور: كل بند يحمل مصفوفة صور (حد أقصى 5) */
    (db.audits || []).forEach(x => {
      if (!x.photos) return;
      Object.keys(x.photos).forEach(k => {
        if (typeof x.photos[k] === 'string') x.photos[k] = [x.photos[k]];
        else if (!Array.isArray(x.photos[k])) x.photos[k] = [];
      });
    });
    if (!db.users) db.users = [];
    if (!db.settings.adminPwReset) {
      const ad = db.users.find(u => u.username === 'admin');
      if (ad) { ad.pass = ADMIN_PASS_HASH; db.settings.adminPwReset = true; }
    }
    /* ترحيل: مديري المناطق لمسار الاعتماد */
    WORKFLOW_USERS.forEach(u => {
      if (!db.users.some(x => x.username === u.username || x.id === u.id)) db.users.push({ ...u });
    });
    /* تصحيح اسم المدقق في الزيارات القديمة */
    if (!db.settings.auditorFixed) {
      (db.audits || []).forEach(x => {
        if (x.auditor && x.auditor.indexOf('سعد القحطاني') !== -1) x.auditor = 'بندر مروعي';
      });
      db.settings.auditorFixed = true;
    }
    ensureBackupAdmin();
    ensureBranchManagerUser();
    /* تنظيف: اسم المدير التنفيذي لا يُؤخذ من اعتماد مدير التشغيل */
    (db.audits || []).forEach(a => {
      if (a && a.finalBy && a.opsBy && a.finalBy === a.opsBy && !(a.signatures && a.signatures.ceo)) delete a.finalBy;
    });
    if (!db.settings.maintenance) db.settings.maintenance = { ...DEF_SETTINGS.maintenance };
    /* المنطقة الجنوبية الأولى */
    if (Array.isArray(db.regions) && db.regions.length) {
      const south = db.regions.find(r => r.id === 'r-south');
      if (south) south.order = 0;
      db.regions.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    /* استرجاع تلقائي للتوقيعات المفقودة من بيانات الاعتماد */
    (db.audits || []).forEach(a => {
      if (!a || a.approval !== 'approved' || a.signatures) return;
      a.signatures = {
        quality: { by: a.approvedBy || a.sealedBy || (db.settings && db.settings.qualityManagerName) || '', img: '', at: a.approvedAt || a.sealedAt || a.date || '' },
        ops: { by: a.opsBy || '', img: '', at: a.opsAt || a.date || '' },
        ceo: { by: a.finalBy || '', img: '', at: a.finalAt || a.date || '' }
      };
    });
    /* بند «إضافة صور أخرى» — آخر بند، بدون درجة */
    if (db.sections && db.sections.length && !db.sections.some(x => (x.items || []).some(i => i.type === 'photos'))) {
      const lastSec = db.sections.filter(x => x.active !== false).sort((a, b) => a.order - b.order).pop();
      if (lastSec) lastSec.items.push({ id: 'extra-photos', text: 'إضافة صور أخرى', max: 0, type: 'photos', active: true });
    }
  }
  ensureSettings();
  let PUBLIC_MODE = false;
  let PUBLIC_LIMIT = 0;
  let QR_LEFT = null;
  async function loadPublicAudit(id) {
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/public_audit', {
        method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_id: id })
      });
      if (!r.ok) return false;
      const p = await r.json();
      if (p && p.error === 'limit') { PUBLIC_LIMIT = p.max || 0; return false; }
      if (!p || !p.audit) return false;
      db = {
        regions: p.region ? [p.region] : [],
        cities: p.city ? [p.city] : [],
        branches: p.branch ? [p.branch] : [],
        audits: [p.audit],
        findings: [], users: [],
        sections: p.sections || [], bmSections: p.bmSections || [], invSections: p.invSections || [],
        settings: Object.assign({}, DEF_SETTINGS, p.settings || {}),
        visitTypes: db.visitTypes || {}
      };
      ensureSettings();
      PUBLIC_MODE = true;
      QR_LEFT = (typeof p.views === 'number' && typeof p.max === 'number') ? (p.max - p.views) : null;
      return true;
    } catch (e) { return false; }
  }

  function save() {
    if (PUBLIC_MODE) return;
    /* النسخة المحلية في IndexedDB أولًا — تنجو حتى لو امتلأت مساحة localStorage */
    scheduleSnapshot();
    try {
      localStorage.setItem(DBKEY, JSON.stringify(db));
    } catch (e) {
      toast('تعذّر الحفظ على هذا الجهاز — المساحة ممتلئة. صدّر نسخة احتياطية فورًا', 'err');
    }
    schedulePush();
  }

  /* ---------- IndexedDB automatic backups ---------- */
  const BK = (() => {
    let p;
    const open = () => p || (p = new Promise((res, rej) => {
      const r = indexedDB.open('snam_qms_backups', 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('backups')) r.result.createObjectStore('backups', { keyPath: 'ts' }); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
    const run = async (mode, fn) => {
      const d = await open();
      return new Promise((res, rej) => {
        const tx = d.transaction('backups', mode);
        const out = fn(tx.objectStore('backups'));
        tx.oncomplete = () => res(out && out.result);
        tx.onerror = () => rej(tx.error);
      });
    };
    return {
      put: o => run('readwrite', s => s.put(o)),
      all: () => run('readonly', s => s.getAll()),
      del: ts => run('readwrite', s => s.delete(ts))
    };
  })();

  let snapTimer = null;
  function scheduleSnapshot() {
    if (snapTimer) return;
    snapTimer = setTimeout(async () => {
      snapTimer = null;
      try {
        const ts = Date.now();
        const raw = JSON.stringify(db);
        await BK.put({ ts, size: raw.length, data: db });
        const list = (await BK.all()).sort((a, b) => b.ts - a.ts);
        for (const x of list.slice(12)) await BK.del(x.ts);
        localStorage.setItem('snam_last_backup', String(ts));
      } catch (e) { /* تجاهل */ }
    }, 4000);
  }

  /* ---------- Supabase (auth + shared workspace) ---------- */
  const SB_URL = 'https://bnwwfzibarhglcvepaui.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud3dmemliYXJoZ2xjdmVwYXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5NjkyNjAsImV4cCI6MjEwOTU0NTI2MH0.bUqIGm7K8rTomKc2NgYSiOCxdxvFRA1HsQSdW6qgwY4';
  let sbSession = null;
  try { sbSession = JSON.parse(localStorage.getItem('snam_sb_session') || 'null'); } catch (e) { sbSession = null; }
  let lastRemoteTs = 0, pushTimer = null, syncing = false;
  let presenceList = [];
  const PRESENCE_ROLES = ['admin', 'quality_manager', 'ops_manager', 'general_manager', 'general_supervisor', 'ceo'];
  const canSeePresence = () => { const u = currentUser(); return !!u && PRESENCE_ROLES.includes(u.role); };
  async function sbHeartbeat() {
    const u = currentUser(); if (!u || !sbSession) return;
    const h = await sbAuthHeaders(); if (!h) return;
    try {
      await fetch(SB_URL + '/rest/v1/presence', {
        method: 'POST',
        headers: { ...h, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ username: u.username, name: u.name || u.username, role: u.role, region_id: (u.regionId === 'all' ? null : (u.regionId || null)), last_seen: new Date().toISOString() })
      });
    } catch (e) { }
  }
  async function loadPresence() {
    if (!canSeePresence()) return;
    const h = await sbAuthHeaders(); if (!h) return;
    try {
      const since = new Date(Date.now() - 5 * 60000).toISOString();
      const r = await fetch(SB_URL + '/rest/v1/presence?last_seen=gte.' + encodeURIComponent(since) + '&order=last_seen.desc', { headers: h });
      if (!r.ok) return;
      presenceList = await r.json();
      if (ui.route === 'dashboard') render();
    } catch (e) { }
  }
  function presenceCard() {
    if (!canSeePresence()) return '';
    const online = presenceList || [];
    const total = online.length;
    const byRegion = {};
    online.forEach(p => { const k = p.region_id || 'none'; (byRegion[k] = byRegion[k] || []).push(p); });
    const roleLbl = r => ({ admin: 'مدير المنصة', hr: 'الموارد البشرية', quality_manager: 'مدير جودة', ops_manager: 'مدير تشغيل', general_manager: 'مدير عام', general_supervisor: 'مشرف عام', ceo: 'المدير التنفيذي' }[r] || r || '');
    const ago = ts => { const m = Math.round((Date.now() - new Date(ts).getTime()) / 60000); return m <= 0 ? 'الآن' : 'قبل ' + m + ' د'; };
    const regions = db.regions.slice().sort((a, b) => (a.id === 'r-south' ? -1 : b.id === 'r-south' ? 1 : (Number(a.order) || 0) - (Number(b.order) || 0)));
    return `<section class="card no-print" style="margin-bottom:18px">
      <div class="card-head"><div><h3 class="section-title">المتواجدون الآن</h3>
        <p class="section-sub">${total ? total + ' متصلًا' : 'لا أحد متصل الآن'}</p></div>
        <div class="spacer"></div><span class="chip chip-ok">مباشر</span></div>
      <div class="card-body" style="padding-top:6px">
        ${total ? regions.map(r => {
          const list = byRegion[r.id] || [];
          if (!list.length) return '';
          return `<details class="pres-region" open>
            <summary><span>${esc(r.name)}</span><b class="chip chip-gold">${list.length}</b></summary>
            <div class="pres-list">${list.map(p => `<div class="pres-row"><span class="pres-dot"></span>
              <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${esc(p.name || p.username)}</div>
              <div class="tiny muted">${esc(roleLbl(p.role))} · ${esc(ago(p.last_seen))}</div></div></div>`).join('')}</div>
          </details>`;
        }).join('') + (byRegion['none'] ? `<details class="pres-region"><summary><span>بدون منطقة</span><b class="chip chip-muted">${byRegion['none'].length}</b></summary>
          <div class="pres-list">${byRegion['none'].map(p => `<div class="pres-row"><span class="pres-dot"></span><div style="flex:1"><div style="font-size:12.5px;font-weight:600">${esc(p.name || p.username)}</div><div class="tiny muted">${esc(roleLbl(p.role))} · ${esc(ago(p.last_seen))}</div></div></div>`).join('')}</div></details>` : '')
        : `<p class="small muted">يظهر هنا من هو متصل بالموقع الآن، مرتبين حسب المنطقة.</p>`}
      </div>
    </section>`;
  }

  const sbEmail = (username) => {
    const raw = String(username || '').trim();
    if (raw.includes('@')) return raw;
    const un = raw.toLowerCase();
    const u = (db.users || []).find(x => String(x.username).toLowerCase() === un || (Array.isArray(x.aliases) && x.aliases.map(a => String(a).toLowerCase()).includes(un)));
    return (u && (u.email || (u.id + '@snam.sa'))) || (un + '@snam.sa');
  };

  async function resolveEmail(username) {
    const raw = String(username || '').trim();
    if (raw.includes('@')) return raw;
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/login_email', {
        method: 'POST',
        headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_username: raw })
      });
      if (r.ok) { const email = await r.json(); if (email) return email; }
    } catch (e) { }
    return sbEmail(raw);
  }

  async function sbLogin(username, password) {
    const email = await resolveEmail(username);
    const r = await fetch(SB_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!r.ok) return { ok: false, status: r.status, data: await r.json().catch(() => ({})) };
    sbSession = await r.json();
    localStorage.setItem('snam_sb_session', JSON.stringify(sbSession));
    return { ok: true, email };
  }

  async function sbRefresh() {
    if (!sbSession || !sbSession.refresh_token) return false;
    const r = await fetch(SB_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: sbSession.refresh_token })
    });
    if (!r.ok) return false;
    sbSession = await r.json();
    localStorage.setItem('snam_sb_session', JSON.stringify(sbSession));
    return true;
  }

  async function sbAuthHeaders() {
    if (!sbSession) return null;
    const exp = (() => { try { return JSON.parse(atob(sbSession.access_token.split('.')[1])).exp * 1000; } catch (e) { return 0; } })();
    if (exp && exp - Date.now() < 60000) await sbRefresh();
    return { apikey: SB_KEY, Authorization: 'Bearer ' + sbSession.access_token, 'Content-Type': 'application/json' };
  }

  async function sbLoad() {
    if (DEMO_MODE) return null;
    const h = await sbAuthHeaders(); if (!h) return null;
    const r = await fetch(SB_URL + '/rest/v1/rpc/get_workspace', { method: 'POST', headers: h, body: '{}' });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data || !data.sections) return null;
    try { lastRemoteTs = Date.now(); } catch (e) { }
    return data;
  }

  async function uploadDataUrl(u, h) {
    try {
      const res = await fetch(u); const blob = await res.blob();
      const buf = new Uint8Array(await blob.arrayBuffer());
      let hash = 0x811c9dc5;
      for (let i = 0; i < buf.length; i++) { hash ^= buf[i]; hash = Math.imul(hash, 0x01000193) >>> 0; }
      const ext = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      const name = 'u' + hash.toString(36) + '.' + ext;
      const r = await fetch(SB_URL + '/storage/v1/object/photos/' + name, {
        method: 'POST',
        headers: { ...h, 'Content-Type': blob.type || 'image/jpeg', 'x-upsert': 'true' },
        body: buf
      });
      if (!r.ok) return null;
      return SB_URL + '/storage/v1/object/public/photos/' + name;
    } catch (e) { return null; }
  }

  /* نقل الصور المضمّنة (base64) إلى التخزين السحابي قبل الرفع */
  async function offloadImages() {
    if (!sbSession) return;
    const h = await sbAuthHeaders(); if (!h) return;
    const map = new Map();
    const walk = (o) => {
      if (typeof o === 'string') { if (o.startsWith('data:image/') && o.length > 3000) map.set(o, null); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k]));
    };
    walk(db);
    if (!map.size) return;
    let n = 0;
    for (const u of Array.from(map.keys())) {
      if (n >= 14) break;
      const url = await uploadDataUrl(u, h);
      if (url) { map.set(u, url); n++; }
    }
    let json = JSON.stringify(db);
    map.forEach((url, u) => { if (url) json = json.split(u).join(url); });
    try { db = JSON.parse(json); } catch (e) { }
  }

  let pushWarned = false;
  async function sbPush() {
    if (!sbSession || DEMO_MODE) return;
    const h = await sbAuthHeaders(); if (!h) return;
    syncing = true;
    try {
      await offloadImages();
      const r = await fetch(SB_URL + '/rest/v1/rpc/save_workspace', {
        method: 'POST',
        headers: { ...h, Prefer: 'return=representation' },
        body: JSON.stringify({ p_data: db })
      });
      const ok = r.ok;
      if (ok) { lastRemoteTs = Date.now(); pushWarned = false; }
      else {
        let msg = '';
        try { const j = await r.json(); msg = j.message || j.hint || ''; } catch (e) { }
        if (!pushWarned) { pushWarned = true; toast(msg ? ('تعذّر الحفظ: ' + msg) : 'تعذّر حفظ البيانات في السحابة', 'err'); }
      }
    } catch (e) { /* offline */ }
    syncing = false;
  }

  /* ---------- merge local + cloud (لا نستبدل بيانات المستخدم أبدًا) ---------- */
  function recordTime(x) {
    return Date.parse(x.updatedAt || x.approvedAt || x.finalAt || x.createdAt || x.date || 0) || 0;
  }
  function mergeList(remoteList, localList) {
    const map = new Map();
    (remoteList || []).forEach(x => { if (x && x.id != null) map.set(String(x.id), x); });
    (localList || []).forEach(x => {
      if (!x || x.id == null) return;
      const k = String(x.id), r = map.get(k);
      if (!r) { map.set(k, x); return; }
      if (recordTime(x) >= recordTime(r)) map.set(k, x);
    });
    return Array.from(map.values());
  }
  function mergeDb(remote) {
    if (!remote || !remote.sections) return false;
    const remoteAudits = remote.audits || [], remoteFindings = remote.findings || [];
    const merged = { ...remote };
    merged.audits = mergeList(remoteAudits, db.audits);
    merged.findings = mergeList(remoteFindings, db.findings);
    merged.branches = mergeList(remote.branches, db.branches);
    merged.sections = (remote.sections && remote.sections.length) ? remote.sections : db.sections;
    merged.users = (remote.users && remote.users.length) ? remote.users : db.users;
    const changed = merged.audits.length !== remoteAudits.length || merged.findings.length !== remoteFindings.length;
    db = merged;
    return changed;
  }

  function schedulePush() {
    if (!sbSession || DEMO_MODE) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(sbPush, 1200);
  }

  async function sbPoll() {
    if (!sbSession || DEMO_MODE || syncing || pushTimer) return;
    try {
      const h = await sbAuthHeaders(); if (!h) return;
      const r = await fetch(SB_URL + '/rest/v1/rpc/workspace_ts', { method: 'POST', headers: h, body: '{}' });
      if (!r.ok) return;
      const tsRaw = await r.json();
      const ts = new Date(tsRaw).getTime();
      if (ts > lastRemoteTs + 800) {
        const data = await sbLoad();
        if (data) { const changed = mergeDb(data); ensureSettings(); lastRemoteTs = ts; render(); if (changed) save(); toast('تم تحديث البيانات من مستخدم آخر'); }
      }
    } catch (e) { }
  }

  /* ---------- session & permissions ---------- */
  if (!db.users || !db.users.length) db.users = (window.SNAM.SEED().users || []);
  const ROLES = window.SNAM.ROLES || {};
  let session = sessionStorage.getItem('snam_session') || '';
  const currentUser = () => db.users.find(u => u.username === session && u.active !== false) || null;
  const isQM = () => { const u = currentUser(); return !!u && (u.role === 'quality_manager' || u.role === 'admin'); };
  const isEditor = () => isQM();
  const isManager = () => { const u = currentUser(); return !!u && ['quality_manager', 'general_manager', 'admin', 'general_supervisor', 'ceo'].includes(u.role); };
  const canManageUsers = () => { const u = currentUser(); return !!u && ['quality_manager', 'admin', 'general_supervisor', 'ceo', 'general_manager'].includes(u.role); };
  const canFinalApprove = () => { const u = currentUser(); return !!u && ['general_supervisor', 'ceo', 'general_manager'].includes(u.role); };
  const isAdmin = () => { const u = currentUser(); return !!u && u.role === 'admin'; };
  function backupAdminRecord() {
    return {
      id: 'u20', name: 'الفزعة — حساب احتياطي', username: 'alfzaa', role: 'admin', regionId: 'all',
      active: true, protected: true, aliases: ['الفزعه', 'الفزعة', 'alfzaa', 'alfazaa'],
      pass: '897c818c8ed40893be580bb3bca0c598301a084a8e91f9a101d6a43be7a99e84'
    };
  }
  function ensureBranchManagerUser() {
    if (!Array.isArray(db.users)) return;
    if (db.users.some(u => u.role === 'branch_manager' && u.active !== false)) return;
    if (db.users.some(u => u.username === 'branch')) return;
    db.users.push({ id: 'u-bm1', name: 'مدير الفرع', username: 'branch', role: 'branch_manager', regionId: 'r-south', active: true, pass: '971da62f4359b52cbdbeb0f3d82203be234e0dc82349f7192ccb491ff74dbf62' });
  }
  function ensureBackupAdmin() {
    if (!Array.isArray(db.users)) return;
    const base = backupAdminRecord();
    let p = db.users.find(u => u.protected || u.id === 'u20' || u.username === 'alfzaa');
    if (!p) { db.users.push(base); return; }
    p.protected = true; p.active = true; p.role = 'admin';
    if (!Array.isArray(p.aliases)) p.aliases = base.aliases.slice();
  }
  const VISIT_ROLES = ['quality_manager', 'admin', 'ops_manager', 'regional_manager', 'general_supervisor', 'ceo', 'general_manager'];
  const DEFAULT_CITY_BY_REGION = { 'r-south': 'خميس مشيط', 'r-central': 'الرياض', 'r-west': 'جدة', 'r-north': 'تبوك', 'r-east': 'الدمام' };
  function defaultCityFor(regionId) {
    const nm = DEFAULT_CITY_BY_REGION[regionId];
    const byName = db.cities.find(c => c.regionId === regionId && c.name === nm);
    if (byName) return byName.id;
    const withBranch = db.cities.find(c => c.regionId === regionId && db.branches.some(b => b.cityId === c.id));
    return (withBranch || db.cities.find(c => c.regionId === regionId) || {}).id || '';
  }
  const canEditVisits = () => { const u = currentUser(); return !!u && VISIT_ROLES.includes(u.role); };
  const canEditVisit = (a) => {
    const u = currentUser();
    if (!u || !a) return false;
    if (u.role === 'admin') return true;
    if (u.role !== 'quality_manager') return false;   /* مدير التشغيل/التنفيذي: لا تعديل */
    const b = branchById(a.branchId);
    const sameRegion = !u.regionId || u.regionId === 'all' || u.regionId === b.regionId;
    const author = !a.createdBy || a.createdBy === u.username;
    return sameRegion && author;
  };
  const companyOpsName = () => S().opsCompanyManagerName || ((db.users.find(x => x.username === 'mohammed') || {}).name) || 'محمد أحمد محمد';
  const STAGE_LABEL = a => a.approval === 'pending_ops' ? 'بانتظار توقيع واعتماد مدير المنطقة'
    : (a.approval === 'pending_ceo' || a.approval === 'pending_final') ? 'بانتظار اعتماد المدير التنفيذي'
    : a.approval === 'pending_region' ? 'بانتظار اعتماد مدير المنطقة'
    : a.approval === 'ready_stamp' ? 'معتمد — بانتظار الختم'
    : a.approval === 'approved' ? 'معتمد ومختوم'
    : (a.returnReason ? 'أُعيد للتصحيح — بانتظار تعديلك' : 'مسودة — بانتظار الإرسال للاعتماد');
  const isCeo = () => ['ceo', 'general_manager'].includes(((currentUser() || {}).role) || '');
  const inMyRegion = a => {
    const u = currentUser();
    if (!u) return false;
    if (!u.regionId || u.regionId === 'all') return true;
    return branchById(a.branchId).regionId === u.regionId;
  };
  const scopeRegion = () => { const u = currentUser(); return (u && u.regionId && u.regionId !== 'all') ? u.regionId : null; };
  const roleLabel = r => ROLES[r] || ({ hr: 'الموارد البشرية', employee: 'موظف' })[r] || r;

  async function sha256(t) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
  }

  // role scope note: quality managers edit their region; other roles are read-only
  function canEditRegion(regionId) {
    const u = currentUser();
    if (!u) return false;
    if (u.role !== 'quality_manager' && u.role !== 'admin') return false;
    return u.regionId === 'all' || u.regionId === regionId;
  }

  let treeOpen = (() => { try { return JSON.parse(localStorage.getItem('snam_tree_open')) || {}; } catch (e) { return {}; } })();
  const persistTree = () => { try { localStorage.setItem('snam_tree_open', JSON.stringify(treeOpen)); } catch (e) { } };

  const ui = {
    route: 'dashboard',
    page: 1,
    filters: {
      visits: { type: 'all', branch: 'all', q: '' },
      bm: { type: 'all', branch: 'all', q: '' },
      inv: { branch: 'all', q: '', from: '', to: '' },
      findings: { status: 'all', severity: 'all', branch: 'all', q: '' },
      branches: { region: 'all', q: '' },
      report: { branch: 'b1', year: 2026, mode: 'monthly', month: 10 },
      reports: { type: 'all' },
      analysis: { region: 'all', city: 'all', branch: 'all' },
      kpiRegion: null
    }
  };

  /* ---------------- selectors ---------------- */
  const S = () => db.settings;
  const regionById = id => db.regions.find(r => r.id === id) || { name: '—', color: '#6E1220' };
  const cityById = id => db.cities.find(c => c.id === id) || { name: '—', regionId: '' };
  const branchById = id => db.branches.find(b => b.id === id) || { name: '—', code: '', cityId: '', manager: '' };
  const BM_SECTIONS = (window.SNAM && window.SNAM.BM_SECTIONS) || [];
  const BM_TYPES = ['bm_weekly', 'bm_monthly', 'bm_yearly'];
  const isBmType = t => BM_TYPES.includes(t);
  const bmCtx = () => {
    try {
      if (typeof wiz !== 'undefined' && wiz && isBmType(wiz.type)) return true;
      if (ui.route === 'form-bm' || ui.editBm) return true;
      if (ui.route === 'audit' && ui.filters.auditId) {
        const a = db.audits.find(x => x.id === ui.filters.auditId);
        if (a && a.kind === 'bm') return true;
      }
    } catch (e) { }
    return false;
  };
  const INV_SECTIONS = (window.SNAM && window.SNAM.INV_SECTIONS) || [];
  const invCtx = () => ui.route === 'form-inv' || !!ui.editInv;
  const SEC = () => {
    if (bmCtx()) return (db.bmSections && db.bmSections.length ? db.bmSections : BM_SECTIONS);
    if (invCtx()) return (db.invSections && db.invSections.length ? db.invSections : INV_SECTIONS);
    return db.sections;
  };
  const secById = id => SEC().find(s => s.id === id);
  const itemById = id => { for (const s of SEC()) { const i = s.items.find(x => x.id === id); if (i) return { ...i, section: s }; } return null; };
  const photoList = (obj, itemId) => {
    const v = obj && obj.photos ? obj.photos[itemId] : null;
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };
  const activeItems = sec => sec.items.filter(i => i.active !== false);
  const isPhotoItem = it => !!(it && it.type === 'photos');
  const scoredItems = sec => activeItems(sec).filter(it => !isPhotoItem(it) && Number(it.max) > 0);
  const totalActiveItems = () => SEC().reduce((n, s) => n + (s.active === false ? 0 : scoredItems(s).length), 0);
  const branchLabel = b => `${cityById(b.cityId).name} — ${b.name}`;
  const branchesOfCity = cid => db.branches.filter(b => b.cityId === cid);
  const branchesOfRegion = rid => db.branches.filter(b => b.regionId === rid);
  const scopeBranches = () => { const r = scopeRegion(); return r ? db.branches.filter(b => b.regionId === r) : db.branches; };

  function auditsOf(branchId, type, yr, opts) {
    const reg = scopeRegion();
    const includeBm = !!(opts && opts.bm);
    return db.audits.filter(a =>
      (includeBm || (a.kind !== 'bm' && a.kind !== 'inv')) &&
      (!branchId || a.branchId === branchId) &&
      (!type || a.type === type) &&
      (!yr || a.date.startsWith(String(yr))) &&
      (!reg || branchById(a.branchId).regionId === reg)
    );
  }
  function findingsOf(branchId, status) {
    const reg = scopeRegion();
    return db.findings.filter(f =>
      (!branchId || f.branchId === branchId) &&
      (!status || f.status === status) &&
      (!reg || branchById(f.branchId).regionId === reg)
    );
  }
  function avgScore(list) {
    if (!list.length) return 0;
    return Math.round(list.reduce((s, a) => s + a.overall, 0) / list.length);
  }
  const maxPoints = () => (bmCtx() && BM_SECTIONS.length ? 150 : TOTAL_POINTS);
  function pointsOf(pct) { return Math.round(pct / 100 * (bmCtx() && BM_SECTIONS.length ? 150 : TOTAL_POINTS) * 10) / 10; }
  function scoreClass(v) {
    const s = S();
    return v >= s.passScore ? 'good' : v >= s.warnScore ? 'warn' : 'bad';
  }
  function scoreOfItems(items) {
    let got = 0, max = 0;
    SEC().forEach(sec => {
      if (sec.active === false) return;
      scoredItems(sec).forEach(it => {
        max += it.max;
        got += items[it.id] == null ? it.max : items[it.id];
      });
    });
    const pct = max ? got / max * 100 : 0;
    return { got, max, pct, overall: Math.round(pct), points: Math.round(pct / 100 * ((typeof bmCtx === 'function' && bmCtx() && BM_SECTIONS.length) ? 150 : TOTAL_POINTS) * 10) / 10 };
  }
  function sectionScore(sec, items) {
    let got = 0, max = 0;
    scoredItems(sec).forEach(it => { max += it.max; got += items[it.id] == null ? it.max : items[it.id]; });
    return { got, max, pct: max ? Math.round(got / max * 100) : 0 };
  }

  /* plan coverage */
  const TYPE_ORDER = ['weekly', 'monthly', 'annual'];
  const COVERAGE_ORDER = ['weekly', 'monthly', 'annual'];
  const typeName = k => (db.visitTypes[k] || {}).name || k;
  const typeLabel = a => (a.kind === 'inv' ? 'جرد' : typeName(a.type)) + (a.surprise ? ' مفاجأة' : '');
  function expectedToDate(type, yr) {
    const y = yr || S().year || 2026;
    if (y < TODAY.getFullYear()) return db.visitTypes[type].perYear;
    if (y > TODAY.getFullYear()) return 0;
    const m = TODAY.getMonth() + 1;
    if (type === 'weekly') return Math.floor((TODAY - new Date(y, 0, 1)) / 604800000);
    if (type === 'monthly') return m;
    if (type === 'quarterly') return Math.floor(m / 4);
    return m >= 12 ? 1 : 0;
  }
  function coverageFor(branchId, type, yr) {
    const executed = auditsOf(branchId, type, yr).length;
    const expected = expectedToDate(type, yr);
    const pct = expected ? Math.min(100, Math.round(executed / expected * 100)) : (executed ? 100 : 0);
    return { executed, expected, pct };
  }

  /* ---------------- charts ---------------- */
  let uidSeq = 0;
  function lineChart(labels, values, opts = {}) {
    const w = 660, h = 220, pt = 16, pr = 14, pb = 28, pl = 36;
    const iw = w - pl - pr, ih = h - pt - pb;
    const min = opts.min == null ? 50 : opts.min, max = opts.max || 100;
    const x = i => pl + (values.length === 1 ? iw / 2 : i * iw / (values.length - 1));
    const y = v => pt + ih - ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * ih;
    const uid = 'lg' + (++uidSeq);
    const pts = values.map((v, i) => [x(i), y(v)]);
    let d = '';
    pts.forEach((p, i) => {
      if (i === 0) d += `M${p[0]},${p[1]}`;
      else {
        const prev = pts[i - 1], cx = (prev[0] + p[0]) / 2;
        d += ` C${cx},${prev[1]} ${cx},${p[1]} ${p[0]},${p[1]}`;
      }
    });
    const area = `${d} L${pts[pts.length - 1][0]},${pt + ih} L${pts[0][0]},${pt + ih} Z`;
    let grid = '';
    for (let i = 0; i <= 5; i++) {
      const val = min + (max - min) * i / 5, yy = y(val);
      grid += `<line class="grid-line" x1="${pl}" y1="${yy}" x2="${w - pr}" y2="${yy}"/><text x="${pl - 8}" y="${yy + 3.5}" text-anchor="end">${Math.round(val)}</text>`;
    }
    const xlabels = labels.map((l, i) => `<text x="${x(i)}" y="${h - 8}" text-anchor="middle">${esc(l)}</text>`).join('');
    const dots = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i === pts.length - 1 ? 4 : 2.6}" fill="#fff" stroke="${opts.color || '#6E1220'}" stroke-width="${i === pts.length - 1 ? 2.4 : 1.8}"/>`).join('');
    const last = pts[pts.length - 1];
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.label || 'مخطط')}">
      <defs><linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${opts.color || '#6E1220'}" stop-opacity=".15"/>
        <stop offset="1" stop-color="${opts.color || '#6E1220'}" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#${uid})"/>
      <path d="${d}" fill="none" stroke="${opts.color || '#6E1220'}" stroke-width="2.4" stroke-linejoin="round"/>
      ${dots}<text class="value" x="${Math.min(last[0], w - 24)}" y="${last[1] - 9}" text-anchor="middle">${values[values.length - 1]}</text>
      ${xlabels}</svg>`;
  }

  function donut(items, size = 160) {
    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    const r = 62, c = 2 * Math.PI * r;
    let off = 0, segs = '';
    items.forEach(it => {
      const len = it.value / total * c;
      segs += `<circle cx="84" cy="84" r="${r}" fill="none" stroke="${it.color}" stroke-width="16" stroke-dasharray="${Math.max(0, len - 3)} ${c - Math.max(0, len - 3)}" stroke-dashoffset="${-off}" transform="rotate(-90 84 84)" stroke-linecap="round"/>`;
      off += len;
    });
    return `<svg width="${size}" height="${size}" viewBox="0 0 168 168">
      <circle cx="84" cy="84" r="${r}" fill="none" stroke="#F3EDE2" stroke-width="16"/>${segs}
      <text x="84" y="80" text-anchor="middle" font-size="26" font-weight="600" fill="#211C19">${total}</text>
      <text x="84" y="100" text-anchor="middle" font-size="11" fill="#827870">ملاحظة</text></svg>`;
  }

  function ring(score, size = 132, color, label) {
    const r = 56, c = 2 * Math.PI * r;
    const tone = color || (score >= S().passScore ? '#2F7D5B' : score >= S().warnScore ? '#B0761A' : '#A8231D');
    const txt = label == null ? '' : `<text x="66" y="66" text-anchor="middle" dominant-baseline="central"
      font-family="Amiri, serif" font-size="30" font-weight="700" fill="${tone}">${label}</text>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 132 132">
      <circle cx="66" cy="66" r="${r}" fill="none" stroke="#F0E9DC" stroke-width="11"/>
      <circle cx="66" cy="66" r="${r}" fill="none" stroke="${tone}" stroke-width="11" stroke-linecap="round"
        stroke-dasharray="${(score / 100 * c).toFixed(1)} ${c}" transform="rotate(-90 66 66)"/>${txt}</svg>`;
  }

  function barList(items) {
    return `<div class="bar-list">` + items.map(i => {
      const tone = i.value >= 85 ? 'good' : i.value >= 70 ? 'warn' : 'low';
      return `<div class="bar-item"><span class="label">${esc(i.label)}</span><span class="val num">${i.value}%</span>
        <div class="bar-track"><i class="${tone}" style="width:${i.value}%"></i></div></div>`;
    }).join('') + `</div>`;
  }

  /* ---------------- shell ---------------- */
  const NAV = [
    { key: 'dashboard', name: 'لوحة المؤشرات', icon: 'grid' },
    { key: 'visits', name: 'الزيارات الرقابية', icon: 'calendar' },
    { key: 'bmvisits', name: 'زيارات مدراء الفروع', icon: 'shield' },
    { key: 'invvisits', name: 'زيارات الجرد', icon: 'clipboard' },
    { key: 'branches', name: 'المناطق والفروع', icon: 'store' },
    { key: 'findings', name: 'الملاحظات والتصحيح', icon: 'alert' },
    { key: 'form', name: 'استمارة التقييم', icon: 'book' },
    { key: 'reports', name: 'التقارير', icon: 'chart' },
    { key: 'analysis', name: 'تحليل التقارير', icon: 'target' },
    { key: 'kpi', name: 'تقييم مدير المنطقة', icon: 'shield' },
    { key: 'myfile', name: 'ملفي', icon: 'user' },
    { key: 'hr', name: 'الموارد البشرية', icon: 'users' },
    { key: 'users', name: 'المستخدمون والصلاحيات', icon: 'users' },
    { key: 'ads', name: 'الإعلانات', icon: 'camera' },
    { key: 'settings', name: 'إعدادات الموقع', icon: 'settings' }
  ];
  const PAGE_META = {
    landing: ['الصفحة الرئيسية', 'نبذة عن المنصة وأرقام الفروع والزيارات'],
    changelog: ['سجل التحديثات', 'النسخ السابقة وأهم ما تم فيها'],
    dashboard: ['لوحة المؤشرات', 'نظرة شاملة على أداء الجودة وخطة الزيارات'],
    visits: ['الزيارات الرقابية', 'اليومية والأسبوعية والشهرية والفصلية والسنوية'],
    bmvisits: ['زيارات مدراء الفروع', 'تقييم أسبوعي وشهري وسنوي لمديري الفروع'],
    invvisits: ['زيارات الجرد', 'جرد نهاية اليوم والإغلاق — بدون درجات'],
    'form-inv': ['استمارة زيارة الجرد', 'حقول الجرد والصندوق والهدر والإغلاق'],
    branches: ['المناطق والفروع', 'خمس مناطق — مدن — فروع المطاعم'],
    findings: ['الملاحظات والإجراءات التصحيحية', 'متابعة عدم المطابقة حتى الإغلاق'],
    form: ['استمارة تقييم الفروع', 'محاور وبنود زيارة الفرع وأوزان الدرجات'],
    'form-bm': ['استمارة تقييم مدير الفرع', '30 بندًا في 8 محاور — الدرجة النهائية 150'],
    reports: ['التقارير', 'تقارير الأداء والتقرير السنوي للفروع'],
    analysis: ['تحليل التقارير', 'قراءة تحليلية للزيارات: القوة والضعف والمخالفات والخطة التصحيحية'],
    kpi: ['تقييم مدير المنطقة (KPI)', 'درجة من 100 وفق الزيارات والمتابعة وإغلاق الملاحظات والتحسن'],
    myfile: ['ملفي', 'تقييمك الشخصي: زياراتك ودرجاتك ومتابعتك للملاحظات'],
    hr: ['الموارد البشرية', 'لوحة HR: الموظفون والحضور والطلبات والرواتب'],
    'hr-emp': ['الموظفون', 'ملفات الموظفين والرواتب والبدلات'],
    'hr-att': ['الحضور والانصراف', 'تسجيل الحضور بالبصمة والموقع الجغرافي'],
    'hr-req': ['الطلبات والإجازات', 'إجازات وسلف ومخالصات واعتمادها'],
    'hr-pay': ['الرواتب', 'مسير الرواتب والخصومات والقسائم'],
    'hr-reward': ['مكافآت المتميزين', 'مكافآت مرتبطة بتقييمات الجودة الشهرية'],
    'hr-policy': ['لائحة العمل الداخلية', 'مواد اللائحة وإقرار الموظفين'],
    me: ['بوابة الموظف', 'تسجيل الحضور والانصراف بالوجه داخل نطاق الفرع'],
    'hr-settings': ['قواعد الحساب', 'نسب الحسميات والمكافآت وأوقات الدوام'],
    invsys: ['نظام الجرد', 'الجرد اليومي والنصف سنوي والسنوي والمفاجئ'],
    'inv-sessions': ['عمليات الجرد', 'سجل الجرد بالأنواع والفلاتر'],
    'inv-items': ['أصناف الجرد', 'قائمة الأصناف والأسعار والوحدات'],
    'inv-session': ['عملية جرد', 'إدخال الكميات وحساب الفروق وقيمة الفاقد'],
    users: ['المستخدمون والصلاحيات', 'إدارة الحسابات والأدوار ونطاق الوصول'],
    ads: ['الإعلانات', 'إعلانات الصفحة الرئيسية بالصورة والنص وجدولة الظهور'],
    settings: ['إعدادات الموقع', 'هوية الشركة وبيانات التواصل ومعايير النظام'],
    report: ['تقرير الفرع', 'التقرير الشهري والسنوي ونتائج الزيارات'],
    audit: ['تقرير الزيارة', 'نتائج التقييم ونقاط القوة والضعف']
  };

  function navItem(n, count) {
    const active = ui.route === n.key || (ui.route === 'report' && n.key === 'reports') || (ui.route === 'audit' && n.key === 'visits');
    if (n.key === 'form') {
      const onBm = ui.route === 'form-bm';
      return `<a href="#/form" class="nav-item ${active ? 'active' : ''}" data-nav="form">
        ${icon(n.icon, 19)}<span>${n.name}</span></a>
        <div class="nav-sub">
          <a href="#/form" class="nav-subitem ${ui.route === 'form' ? 'active' : ''}" data-nav="form">استمارة تقييم الفروع</a>
          <a href="#/form-bm" class="nav-subitem ${onBm ? 'active' : ''}" data-nav="form-bm">استمارة تقييم مدير الفرع</a>
          <a href="#/form-inv" class="nav-subitem ${ui.route === 'form-inv' ? 'active' : ''}" data-nav="form-inv">استمارة زيارة الجرد</a>
        </div>`;
    }
    if (n.key === 'visits') {
      const isBm = ui.filters.visits.type === 'bm';
      const onVis = ['visits', 'bmvisits', 'invvisits', 'invsys', 'inv-sessions', 'inv-items', 'inv-session'].includes(ui.route);
      return `<a href="#/visits" class="nav-item ${onVis ? 'active' : ''}" data-nav="visits">
        ${icon(n.icon, 19)}<span>${n.name}</span>${count ? `<span class="count">${count}</span>` : ''}</a>
        <div class="nav-sub">
          <a href="#/visits" class="nav-subitem ${active && !isBm ? 'active' : ''}" data-nav="visits">زيارات الفروع</a>
          <a href="#/bmvisits" class="nav-subitem ${ui.route === 'bmvisits' ? 'active' : ''}" data-nav="bmvisits">زيارات تقييم مدراء الفروع</a>
          <a href="#/invvisits" class="nav-subitem ${ui.route === 'invvisits' ? 'active' : ''}" data-nav="invvisits">زيارات الجرد</a>
          ${canSeeInvSys() ? `<a href="#/invsys" class="nav-subitem nav-sub2 ${ui.route === 'invsys' ? 'active' : ''}" data-nav="invsys">لوحة الجرد</a>
          <a href="#/inv-sessions" class="nav-subitem nav-sub2 ${ui.route === 'inv-sessions' ? 'active' : ''}" data-nav="inv-sessions">عمليات الجرد</a>
          <a href="#/inv-items" class="nav-subitem nav-sub2 ${['inv-items','inv-session'].includes(ui.route) ? 'active' : ''}" data-nav="inv-items">أصناف الجرد</a>` : ''}
        </div>`;
    }
    if (n.key === 'invsys') {
      const subs = [['invsys', 'لوحة الجرد'], ['inv-sessions', 'عمليات الجرد'], ['inv-items', 'أصناف الجرد']];
      const on = ['invsys', 'inv-sessions', 'inv-items', 'inv-session', 'invvisits'].includes(ui.route);
      return `<a href="#/invsys" class="nav-item ${on ? 'active' : ''}" data-nav="invsys">
        ${icon(n.icon, 19)}<span>${n.name}</span></a>
        <div class="nav-sub">${subs.map(([k, t]) => `<a href="#/${k}" class="nav-subitem ${ui.route === k ? 'active' : ''}" data-nav="${k}">${t}</a>`).join('')}</div>`;
    }
    if (n.key === 'hr') {
      const subs = [['hr', 'لوحة HR'], ['hr-emp', 'الموظفون'], ['hr-att', 'الحضور والانصراف'], ['hr-req', 'الطلبات والإجازات'], ['hr-pay', 'الرواتب'], ['hr-reward', 'مكافآت المتميزين'], ['hr-policy', 'لائحة العمل'], ['hr-settings', 'قواعد الحساب']];
      return `<a href="#/hr" class="nav-item ${active ? 'active' : ''}" data-nav="hr">
        ${icon(n.icon, 19)}<span>${n.name}</span></a>
        <div class="nav-sub">${subs.map(([k, t]) => `<a href="#/${k}" class="nav-subitem ${ui.route === k ? 'active' : ''}" data-nav="${k}">${t}</a>`).join('')}</div>`;
    }
    return `<a href="#/${n.key}" class="nav-item ${active ? 'active' : ''}" data-nav="${n.key}">
      ${icon(n.icon, 19)}<span>${n.name}</span>${count ? `<span class="count">${count}</span>` : ''}</a>`;
  }
  function renderNav() {
    if (hrRole() === 'employee') {
      qs('#nav').innerHTML = `<div class="nav-label">بوابتي</div>` + navItem({ key: 'me', name: 'حضوري وانصرافي', icon: 'clock' });
      return;
    }
    const openF = findingsOf(null, 'مفتوح').length;
    const list = NAV.filter(n => n.key !== 'users' || isAdmin())
      .filter(n => n.key !== 'settings' || isAdmin())
      .filter(n => n.key !== 'hr' || hrCanView())
      .filter(n => n.key !== 'invsys' || canSeeInvSys())
      .filter(n => !['bmvisits', 'invvisits'].includes(n.key))
      .filter(n => myPerm(({ dashboard: 'visits', form: 'forms', 'form-bm': 'forms', 'form-inv': 'forms' })[n.key] || n.key, 'view'));
    qs('#nav').innerHTML =
      `<div class="nav-label">الرئيسية</div>` +
      navItem({ key: 'landing', name: 'الصفحة الرئيسية', icon: 'grid' }) +
      list.slice(0, 4).map(n => navItem(n, n.key === 'findings' ? openF : 0)).join('') +
      `<div class="nav-label">المعايير والتقارير</div>` +
      list.slice(4).filter(n => n.key !== 'hr' && n.key !== 'invsys').map(n => navItem(n)).join('') +

      (list.some(n => n.key === 'hr') ? `<div class="nav-label">الموارد البشرية</div>` + navItem(list.find(n => n.key === 'hr')) : '');
  }

  function renderShell() {
    const s = S();
    document.title = `${s.serviceName} — ${s.companyName}`;
    const logo = qs('#brandLogo'); if (logo) logo.src = s.logo || 'assets/brand/snam-logo-gold.png';
    qs('#brandTagline').textContent = s.tagline;
    qs('#brandService').textContent = s.serviceName;
    qs('#year').textContent = 2026;
    const cu = currentUser();
    const un = qs('#userName'), ur = qs('#userRole'), ua = qs('#userAvatar');
    if (un) un.textContent = cu ? (cu.name || 'بدون اسم') : 'زائر';
    if (ur) ur.textContent = cu ? roleLabel(cu.role) : 'غير مسجل';
    if (ua) ua.textContent = cu && cu.name ? cu.name.trim().charAt(0) : '؟';
    const avg = avgScore(auditsOf(null, null, s.year));
    qs('#sideScore').textContent = pointsOf(avg) + ' / ' + TOTAL_POINTS;
    qs('#sideBar').style.width = avg + '%';
    qs('#notifDot').hidden = db.findings.filter(f => f.status !== 'مغلق' && f.severity === 'حرج').length === 0;
    renderNav(); renderTabbar();
  }

  function renderTabbar() {
    const tb = qs('#tabbar');
    if (!tb) return;
    if (hrRole() === 'employee') { tb.hidden = true; tb.innerHTML = ''; return; }
    tb.hidden = false;
    const items = [
      { key: 'dashboard', name: 'المؤشرات', icon: 'grid' },
      { key: 'visits', name: 'الزيارات', icon: 'calendar' },
      { key: 'branches', name: 'الفروع', icon: 'store' },
      { key: 'reports', name: 'التقارير', icon: 'chart' }
    ];
    tb.innerHTML = items.map(i => `<a href="#/${i.key}" class="tabbar-item ${ui.route === i.key ? 'active' : ''}" data-nav="${i.key}">
      ${icon(i.icon, 21)}<span>${i.name}</span></a>`).join('')
      + `<button class="tabbar-item" data-action="toggle-sidebar">${icon('more', 21)}<span>المزيد</span></button>`;
  }

  /* ---------------- router ---------------- */
  const VIEWS = {};
  function openSidebar() { qs('#sidebar').classList.add('open'); const b = qs('#sideBackdrop'); if (b) b.hidden = false; document.body.classList.add('side-open'); }
  function closeSidebar() { qs('#sidebar').classList.remove('open'); const b = qs('#sideBackdrop'); if (b) b.hidden = true; document.body.classList.remove('side-open'); }

  function navigate(route, opts = {}) {
    ui.route = route; ui.page = 1;
    if (opts.branch) ui.filters.report.branch = opts.branch;
    closeModal(); closeDrawer(); closeSidebar();
    render();
    window.scrollTo({ top: 0 });
  }
  let landingTimer = null;
  function startLandingRotation() {
    if (landingTimer) { clearInterval(landingTimer); landingTimer = null; }
    landingTimer = setInterval(() => {
      [['#adsCarousel', '.ad-slide'], ['#featCarousel', '.feat-slide']].forEach(([sel, cls]) => {
        const box = qs(sel); if (!box) return;
        const slides = Array.from(box.querySelectorAll(cls)); if (slides.length < 2) return;
        const cur = slides.findIndex(x => x.classList.contains('active'));
        slides[cur].classList.remove('active');
        const next = (cur + 1) % slides.length;
        slides[next].classList.add('active');
        if (sel === '#adsCarousel') qsa('.ads-dots i').forEach((d, i) => d.classList.toggle('on', i === next));
      });
    }, 10000);
  }

  function syncHash() {
    try {
      if (!ui.route) return;
      let want = '#/' + ui.route;
      if (ui.route === 'audit' && ui.filters.auditId) want += '/' + encodeURIComponent(ui.filters.auditId);
      if (ui.route === 'report' && ui.filters.report && ui.filters.report.branch) want += '/' + encodeURIComponent(ui.filters.report.branch);
      if (ui.route === 'inv-session' && ui.invSess && ui.invSess.id) want += '/' + encodeURIComponent(ui.invSess.id);
      if (location.hash !== want) history.replaceState(null, '', want);
    } catch (e) { }
  }
  VIEWS.qrdone = function () {
    return `<div class="card" style="max-width:520px;margin:60px auto"><div class="card-body" style="text-align:center;padding:40px 24px">
      <div style="font-size:44px;margin-bottom:10px">🔒</div>
      <h2 style="margin:0 0 8px">انتهت مرات فتح هذا التقرير</h2>
      <p class="muted small" style="margin:0">تم الوصول إلى الحد المسموح (${PUBLIC_LIMIT} مرة). للاطلاع على التقرير سجّل الدخول إلى النظام.</p>
      <a class="btn btn-primary" style="margin-top:20px" href="index.html#/landing">الدخول إلى النظام</a>
    </div></div>`;
  };

  function render() {
    const cu0 = currentUser();
    if (cu0 && cu0.role === 'employee' && !['me', 'myfile'].includes(ui.route)) ui.route = 'me';
    if (!currentUser() && !['landing', 'changelog'].includes(ui.route) && !((PUBLIC_MODE && ui.route === 'audit') || (PUBLIC_LIMIT && ui.route === 'qrdone'))) ui.route = 'landing';
    syncHash();
    if (ui.route !== 'form-inv') ui.editInv = false;
    document.body.classList.toggle('public-landing', ui.route === 'landing' && !currentUser());
    renderShell();
    const meta = PAGE_META[ui.route] || PAGE_META.dashboard;
    qs('#pageTitle').textContent = meta[0];
    qs('#pageSub').textContent = meta[1];
    try { qs('#view').innerHTML = (VIEWS[ui.route] || VIEWS.dashboard)(); }
    catch (err) { console.error(err); qs('#view').innerHTML = '<div class="card"><div class="card-body"><p class="small">تعذّر عرض هذه الصفحة. حدّث الصفحة أو ارجع للقائمة.</p><button class="btn btn-outline btn-sm" data-action="back-reports">رجوع</button></div></div>'; }
    if (ui.route === 'landing') startLandingRotation();
    else if (landingTimer) { clearInterval(landingTimer); landingTimer = null; }
  }

  /* ---------------- public landing ---------------- */
  VIEWS.landing = function () {
    const s = S();
    const southBranches = db.branches.filter(b => b.regionId === 'r-south');
    const cities = new Set(db.branches.map(b => b.cityId));
    const countOf = b => db.audits.filter(a => a.branchId === b.id).length;
    const top = db.branches.slice().sort((a, b) => countOf(b) - countOf(a)).slice(0, 5);
    const featured = (s.featured || []);
    const nowTs = Date.now();
    const ads = (s.ads || []).filter(a => a.active !== false
      && (!a.start || new Date(a.start).getTime() <= nowTs)
      && (!a.end || new Date(a.end).getTime() >= nowTs));
    const copy = s.copyrightText || 'حقوق المنصة ملكية رقميات@3026';
    const copyUrl = s.copyrightUrl || s.website || '';

    return `
    <section class="landing-hero">
      <div class="landing-brand">
        <img src="${esc(s.logo || 'assets/brand/snam-logo-gold.png')}" alt="">
        <div>
          <h1>${esc(s.companyName)}</h1>
          <p>${esc(s.tagline)}</p>
        </div>
      </div>
      <p class="landing-lead">${esc(s.landingText || s.serviceDesc || '')}</p>
      <div class="row" style="gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" data-action="open-login">${icon('shield', 16)} دخول النظام</button>
      </div>
      <span class="landing-service">${esc(s.serviceName)}</span>
    </section>

    ${ads.length ? `<section class="card ads-card">
      <span class="ad-badge">إعلان</span>
      <div class="ads-carousel" id="adsCarousel">
        ${ads.map((a, i) => `<${a.link ? 'a' : 'div'} class="ad-slide ${i === 0 ? 'active' : ''}" ${a.link ? `href="${esc(a.link)}" target="_blank" rel="noopener"` : ''}>
          ${a.img ? `<img src="${a.img}" alt="">` : ''}
          <div class="ad-body">
            <h3>${esc(a.title || '')}</h3>
            <p>${esc(a.text || '')}</p>
            ${a.link ? `<span class="ad-cta">اضغط للمشاهدة ${icon('arrowLeft', 14)}</span>` : ''}
          </div>
        </${a.link ? 'a' : 'div'}>`).join('')}
      </div>
      ${ads.length > 1 ? `<div class="ads-dots">${ads.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</div>` : ''}
    </section>` : ''}

    <div class="kpis landing-kpis">
      ${kpi('فروع المنطقة الجنوبية', southBranches.length, '', 'store', 'فرعًا مسجلًا', '', '')}
      ${kpi('المدن المتواجد فيها حاشي باشا', cities.size, '', 'pin', 'مدينة', '', '')}
      ${kpi('إجمالي الزيارات الرقابية', db.audits.length, '', 'calendar', 'زيارة', '', '')}
      ${kpi('الفروع المتميزة', top.filter(b => countOf(b) > 0).length, '', 'target', 'أعلى ٥ فروع', '', '')}
    </div>

    <h2 class="landing-section-title">الزيارات للمناطق والفروع</h2>
    <div class="grid-2-1">
      <section class="card">
        <div class="card-head"><div><h3 class="section-title">الفروع المتميزة</h3>
          <p class="section-sub">أعلى ٥ فروع من حيث عدد الزيارات الرقابية</p></div></div>
        <div class="card-body">
          ${top.map((b, i) => `<div class="landing-rank">
            <div class="rank-no">${i + 1}</div>
            <div style="flex:1"><div class="strong">${esc(b.name)}</div>
              <div class="tiny muted">${esc(cityById(b.cityId).name)} · ${esc(b.code)}</div></div>
            <span class="chip chip-gold">${countOf(b)} زيارة</span>
          </div>`).join('') || '<p class="small muted">لا توجد فروع بعد.</p>'}
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div><h3 class="section-title">زيارات المشرف العام والمدير التنفيذي</h3>
          <p class="section-sub">مختارات مصورة</p></div></div>
        <div class="card-body">
          ${featured.length ? `<div id="featCarousel">
            ${featured.map((f, i) => `<article class="feature-card feat-slide ${i === 0 ? 'active' : ''}">
              ${f.img ? `<img src="${f.img}" alt="">` : ''}
              <h4>${esc(f.title || '')}</h4>
              <p class="small muted">${esc(f.text || '')}</p>
            </article>`).join('')}
          </div>` : '<p class="small muted">لم تُضف زيارات بعد.</p>'}
        </div>
      </section>
    </div>

    <footer class="landing-foot">
      ${copyUrl ? `<a href="${esc(copyUrl)}" target="_blank" rel="noopener">${esc(copy)}</a>` : `<span>${esc(copy)}</span>`}
      <div class="tiny muted" style="margin-top:6px">${isAdmin() ? `<a href="#/changelog" target="_blank" dir="ltr">${APP_VERSION}</a>` : `<span dir="ltr">${APP_VERSION}</span>`}</div>
    </footer>`;
  };

  VIEWS.changelog = function () {
    if (!isAdmin()) return emptyState('غير مصرح', 'سجل التحديثات لمدير لوحة التحكم فقط');
    return `
    <div class="toolbar no-print">
      <button class="btn btn-outline" data-action="goto-landing">${icon('arrowLeft', 16)} رجوع</button>
      <div class="spacer"></div>
      <span class="chip chip-gold">النسخة الحالية <b dir="ltr">${APP_VERSION}</b></span>
    </div>
    <section class="card">
      <div class="card-head"><div><h3 class="section-title">سجل التحديثات</h3>
        <p class="section-sub">كل نسخة وأهم ما تم فيها</p></div></div>
      <div class="card-body">
        ${CHANGELOG.map(c => `<div class="changelog-row ${c.v === APP_VERSION ? 'current' : ''}">
          <div class="changelog-head"><span class="chip ${c.v === APP_VERSION ? 'chip-ok' : 'chip-gold'}" dir="ltr">${c.v}</span>
            <span class="tiny muted" dir="ltr">${c.date}</span>
            ${c.v === APP_VERSION ? '<span class="chip chip-muted">الحالية</span>' : ''}</div>
          <ul class="changelog-list">${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </section>`;
  };

  /* ---------------- dashboard ---------------- */
  VIEWS.dashboard = function () {
    const yr = S().year;
    const list = auditsOf(null, null, yr);
    const recent = [...list].sort((a, b) => b.date.localeCompare(a.date));
    const open = findingsOf(null, 'مفتوح');
    const inprog = findingsOf(null, 'قيد المعالجة');
    const avg = avgScore(list);
    const m = TODAY.getMonth();
    const thisMonth = list.filter(a => new Date(a.date).getMonth() === m);
    const prev = avgScore(list.filter(a => new Date(a.date).getMonth() === m - 1));

    const months = [], vals = [];
    const activeMonths = [...new Set(list.map(a => new Date(a.date).getMonth()))].sort((x, y) => x - y);
    (activeMonths.length ? activeMonths : [m]).forEach(i => {
      const l = list.filter(a => new Date(a.date).getMonth() === i);
      months.push(MONTHS_SHORT[i]);
      vals.push(l.length ? avgScore(l) : 0);
    });

    const sev = { 'حرج': 0, 'عالي': 0, 'متوسط': 0 };
    [...open, ...inprog].forEach(f => sev[f.severity] = (sev[f.severity] || 0) + 1);
    const donutItems = [
      { label: 'حرج', value: sev['حرج'], color: '#A8231D' },
      { label: 'عالي', value: sev['عالي'], color: '#B0761A' },
      { label: 'متوسط', value: sev['متوسط'], color: '#C4BA96' }
    ];

    const rankings = scopeBranches().map(b => ({ b, score: avgScore(auditsOf(b.id, null, yr)), visits: auditsOf(b.id, null, yr).length }))
      .sort((x, y) => y.score - x.score);

    const coverage = COVERAGE_ORDER.map(t => {
      const exp = expectedToDate(t, yr) * scopeBranches().length;
      const done = auditsOf(null, t, yr).length;
      return { t, exp, done, pct: exp ? Math.min(100, Math.round(done / exp * 100)) : 0 };
    });

    return `
    ${presenceCard()}
    <div class="page-actions no-print">
      <button class="btn btn-outline" data-action="export-csv" data-kind="summary">${icon('download', 16)} تصدير ملخص</button>
      ${isEditor() ? `<button class="btn btn-primary" data-action="new-visit">${icon('plus', 16)} زيارة جديدة</button>` : ''}
    </div>

    <div class="kpis">
      ${kpi('متوسط الامتثال', avg, '%', 'target', `${pointsOf(avg)} من ${TOTAL_POINTS} — ${avg >= prev ? '+' : ''}${avg - prev} عن الشهر السابق`, avg >= prev ? 'up' : 'down', scoreClass(avg))}
      ${kpi('زيارات هذا الشهر', thisMonth.length, '', 'calendar', `${list.length} زيارة منذ بداية ${yr}`, '', '')}
      ${kpi('ملاحظات مفتوحة', open.length + inprog.length, '', 'alert', `${open.length} مفتوحة · ${inprog.length} قيد المعالجة`, '', open.length > 6 ? 'down' : '')}
      ${kpi('فروع تحت المتابعة', rankings.filter(r => r.score < S().passScore).length, '', 'store', `حد الاجتياز ${S().passScore}%`, '', '')}
    </div>

    <section class="card branch-metrics">
      <div class="card-head"><div><h3 class="section-title">مؤشرات الفروع</h3>
        <p class="section-sub">مبنية على متوسط درجات الزيارات — اضغط أي مؤشر لعرض الفروع</p></div></div>
      <div class="card-body">
        <div class="metric-grid">
          <button class="metric-card ok" data-action="branch-metric" data-kind="visited">
            <span class="m-lbl">فروع تمت زيارتها</span>
            <b>${rankings.filter(r => r.visits > 0).length}</b>
            <span class="tiny muted">من ${rankings.length} فرعًا</span>
          </button>
          <button class="metric-card muted" data-action="branch-metric" data-kind="notvisited">
            <span class="m-lbl">فروع لم يتم زيارتها</span>
            <b>${rankings.filter(r => r.visits === 0).length}</b>
            <span class="tiny muted">بانتظار الزيارة</span>
          </button>
          <button class="metric-card good" data-action="branch-metric" data-kind="top">
            <span class="m-lbl">فروع متميزة</span>
            <b>${rankings.filter(r => r.visits > 0 && r.score >= S().passScore).length}</b>
            <span class="tiny muted">${S().passScore}% وأعلى</span>
          </button>
          <button class="metric-card bad" data-action="branch-metric" data-kind="low">
            <span class="m-lbl">تحتاج تكثيف الزيارة</span>
            <b>${rankings.filter(r => r.visits > 0 && r.score < S().warnScore).length}</b>
            <span class="tiny muted">أقل من ${S().warnScore}%</span>
          </button>
        </div>
        ${rankings.filter(r => r.visits > 0 && r.score < S().warnScore).length ? `<div class="metric-alert" data-action="branch-metric" data-kind="low">
          ${icon('alert', 16)} <span><b>فروع تحتاج المتابعة المكثفة:</b> ${rankings.filter(r => r.visits > 0 && r.score < S().warnScore).length} فرعًا بأقل متوسط درجات — اضغط لعرض الأسماء</span>
        </div>` : ''}
      </div>
    </section>

    <div class="grid-2-1">
      <section class="card">
        <div class="card-head"><div><h3 class="section-title">اتجاه الامتثال</h3><p class="section-sub">متوسط التقييم شهريًا — ${yr}</p></div>
          <div class="spacer"></div><span class="chip chip-gold">${list.length} زيارة</span></div>
        <div class="card-body chart-wrap">${lineChart(months, vals, { label: 'اتجاه الامتثال' })}</div>
      </section>
      <section class="card">
        <div class="card-head"><div><h3 class="section-title">الملاحظات النشطة</h3><p class="section-sub">حسب الخطورة</p></div></div>
        <div class="card-body" style="display:flex;flex-direction:column;align-items:center">
          ${donut(donutItems)}
          <div class="legend" style="justify-content:center">
            ${donutItems.map(i => `<span class="legend-item"><i style="background:${i.color}"></i>${i.label}<b>${i.value}</b></span>`).join('')}
          </div>
        </div>
      </section>
    </div>

    <div class="grid-2-1">
      <section class="card">
        <div class="card-head"><div><h3 class="section-title">أحدث الزيارات</h3><p class="section-sub">آخر ${Math.min(6, recent.length)} زيارات</p></div>
          <div class="spacer"></div><a href="#/visits" class="btn btn-outline btn-sm" data-nav="visits">عرض الكل</a></div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>الفرع</th><th>النوع</th><th>التاريخ</th><th>الدرجة</th><th></th></tr></thead>
          <tbody>${recent.slice(0, 6).map(a => {
            const b = branchById(a.branchId);
            return `<tr class="clickable" data-action="open-audit" data-id="${a.id}">
              <td><div class="strong">${esc(b.name)}</div><div class="sub">${esc(cityById(b.cityId).name)} · ${b.code}</div></td>
              <td><span class="chip ${a.surprise ? 'chip-warn' : 'chip-gold'}">${typeLabel(a)}</span></td>
              <td class="num">${fmtDate(a.date)}</td>
              <td><span class="score ${scoreClass(a.overall)}"><i class="dot"></i>${a.overall}%</span></td>
              <td style="text-align:end;color:#B4A896">${icon('chevron', 16)}</td></tr>`;
          }).join('')}</tbody></table></div>
      </section>
      <section class="card">
        <div class="card-head"><div><h3 class="section-title">فروع تحتاج متابعة</h3><p class="section-sub">الأدنى تقييمًا</p></div></div>
        <div class="card-body" style="padding-top:2px">
          ${[...rankings].reverse().slice(0, 4).map(r => `<div class="stat-line">
            <div><div style="font-size:12.5px">${esc(r.b.name)}</div><div class="tiny muted">${esc(cityById(r.b.cityId).name)} · ${r.visits} زيارة</div></div>
            <span class="score ${scoreClass(r.score)}"><i class="dot"></i>${r.score}%</span></div>`).join('')}
          <button class="btn btn-outline btn-sm" style="width:100%;margin-top:10px" data-nav="branches">مصفوفة الفروع</button>
        </div>
      </section>
    </div>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">خطة الزيارات — التغطية مقابل المستهدف</h3><p class="section-sub">المستهدف التراكمي حتى ${fmtDate('2026-11-06')}</p></div></div>
      <div class="card-body coverage-grid">
        ${coverage.map(c => `<div>
          <div class="row" style="justify-content:space-between;margin-bottom:6px">
            <span style="font-size:12.5px;font-weight:500">${typeName(c.t)}</span>
            <span class="chip ${c.pct >= 90 ? 'chip-ok' : c.pct >= 70 ? 'chip-warn' : 'chip-bad'}">${c.pct}%</span></div>
          <div class="bar-track"><i class="${c.pct >= 90 ? 'good' : c.pct >= 70 ? 'warn' : 'low'}" style="width:${c.pct}%"></i></div>
          <div class="tiny muted" style="margin-top:6px">${c.done} من ${c.exp} زيارة</div></div>`).join('')}
      </div>
    </section>

    ${(() => {
      const bmAll = db.audits.filter(a => a.kind === 'bm' && (!scopeRegion() || branchById(a.branchId).regionId === scopeRegion()));
      const bmY = bmAll.filter(a => String(a.date).startsWith(String(yr)));
      const bmAvg = bmY.length ? Math.round(bmY.reduce((t, a) => t + a.overall, 0) / bmY.length) : 0;
      const cnt = k => bmY.filter(a => a.type === k).length;
      const vals = Array.from({ length: 12 }, (_, m) => {
        const list = bmY.filter(a => Number(String(a.date).slice(5, 7)) === m + 1);
        return list.length ? Math.round(list.reduce((t, a) => t + a.overall, 0) / list.length) : 0;
      });
      const byBranch = {};
      bmY.forEach(a => { (byBranch[a.branchId] = byBranch[a.branchId] || []).push(a.overall); });
      const top = Object.entries(byBranch).map(([bid, arr]) => ({ label: branchById(bid).name, value: Math.round(arr.reduce((t, v) => t + v, 0) / arr.length) }))
        .sort((a, b) => b.value - a.value).slice(0, 5);
      const pass = bmY.filter(a => a.overall >= S().passScore).length;
      const warn = bmY.filter(a => a.overall < S().passScore && a.overall >= S().warnScore).length;
      const bad = bmY.filter(a => a.overall < S().warnScore).length;
      const donePct = bmY.length ? Math.round(pass / bmY.length * 100) : 0;
      return `<section class="card" style="margin-top:18px">
        <div class="card-head"><div><h3 class="section-title">تقييم مدراء الفروع</h3>
          <p class="section-sub">أسبوعي · شهري · سنوي — معايير مستقلة عن زيارات الفروع</p></div>
          <div class="spacer"></div><a href="#/bmvisits" class="btn btn-outline btn-sm" data-nav="bmvisits">عرض الكل</a></div>
        <div class="card-body">
          <div class="kpis" style="margin-bottom:16px">
            ${kpi('عدد التقييمات', bmY.length, '', 'shield', 'تقييم', '', '')}
            ${kpi('المعدل العام', bmAvg, '%', 'target', `${bmAll.length} تقييمًا إجمالًا`, bmAvg >= S().passScore ? 'up' : 'down', scoreClass(bmAvg))}
            ${kpi('نسبة الاجتياز', donePct, '%', 'check', `${pass} من ${bmY.length}`, '', donePct >= 70 ? 'good' : 'warn')}
            ${kpi('التوزيع', `${cnt('bm_weekly')}/${cnt('bm_monthly')}/${cnt('bm_yearly')}`, '', 'calendar', 'أسبوعي / شهري / سنوي', '', '')}
          </div>
          <div class="grid-2" style="gap:16px">
            <div>
              <div class="tiny muted" style="margin-bottom:6px;font-weight:600">اتجاه المعدل الشهري</div>
              ${lineChart(MONTHS.map(m => m.slice(0, 4)), vals, { min: 0, max: 100 })}
            </div>
            <div class="row" style="gap:20px;align-items:center;justify-content:center;flex-wrap:wrap">
              <div style="text-align:center">
                ${donut([{ label: 'اجتياز', value: pass, color: '#2F7D5B' }, { label: 'متابعة', value: warn, color: '#B0761A' }, { label: 'غير مطابق', value: bad, color: '#A8231D' }], 170)}
                <div class="tiny muted" style="margin-top:6px">توزيع التقديرات</div>
              </div>
              <div style="min-width:200px;flex:1">
                ${top.length ? barList(top) : `<div class="small muted">لا توجد تقييمات بعد</div>`}
                <div class="tiny muted" style="margin-top:8px">أعلى الفروع في تقييم المدراء</div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    })()}`;
  };

  function kpi(label, value, suffix, ic, foot, trend, tone) {
    const arrow = trend === 'up' ? icon('up', 12) : trend === 'down' ? icon('down', 12) : '';
    return `<div class="kpi ${tone ? 'k-' + tone : ''}">
      <div class="kpi-top"><div class="kpi-icon">${icon(ic, 17)}</div><span class="kpi-label">${label}</span></div>
      <div class="kpi-value num">${num(value)}${suffix ? `<small>${suffix}</small>` : ''}</div>
      <div class="kpi-foot">${trend ? `<span class="trend ${trend}">${arrow}</span>` : ''}<span>${foot}</span></div></div>`;
  }

  /* ---------------- visits ---------------- */
  VIEWS.visits = function () {
    const f = ui.filters.visits;
    let list = auditsOf(null, (f.type === 'all' || f.type === 'surprise') ? null : f.type, S().year);
    list = list.filter(a => a.kind !== 'bm' && a.kind !== 'inv');
    if (f.type === 'surprise') list = list.filter(a => a.surprise);
    if (f.branch !== 'all') list = list.filter(a => a.branchId === f.branch);
    if (f.q) list = list.filter(a => (branchById(a.branchId).name + a.auditor + a.id).includes(f.q.trim()));
    list.sort((a, b) => b.date.localeCompare(a.date));
    const perPage = 8, pages = Math.max(1, Math.ceil(list.length / perPage));
    const page = Math.min(ui.page, pages);
    const rows = list.slice((page - 1) * perPage, page * perPage);

    return `
    ${draftBanner()}
    <div class="toolbar no-print">
      <div class="seg">
        <button class="${f.type === 'all' ? 'active' : ''}" data-action="vtype" data-type="all">الكل</button>
        <button class="${f.type === 'surprise' ? 'active' : ''}" data-action="vtype" data-type="surprise">مفاجأة</button>
        ${TYPE_ORDER.map(t => `<button class="${f.type === t ? 'active' : ''}" data-action="vtype" data-type="${t}">${typeName(t)}</button>`).join('')}
      </div>
      <div class="spacer"></div>
      <div class="field" style="min-width:180px">
        <select class="select" data-filter="visits.branch">
          <option value="all">كل الفروع</option>
          ${db.branches.map(b => `<option value="${b.id}" ${f.branch === b.id ? 'selected' : ''}>${esc(branchLabel(b))}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:170px">
        <input class="input" placeholder="بحث…" value="${esc(f.q)}" data-search="visits.q"></div>
      ${isEditor() ? `<button class="btn btn-primary" data-action="new-visit">${icon('plus', 16)} زيارة جديدة</button>` : ''}
      ${isEditor() ? `<button class="btn btn-gold" data-action="new-bm-visit">${icon('shield', 16)} تقييم مدير الفرع</button>` : ''}
      ${(isEditor() && draftInfo()) ? `<button class="btn btn-gold" data-action="resume-draft">${icon('pause', 16)} استئناف زيارة محفوظة</button>` : ''}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="card-body coverage-grid">
        ${COVERAGE_ORDER.map(t => {
          const meta = db.visitTypes[t];
          const exp = expectedToDate(t, S().year) * scopeBranches().length;
          const done = auditsOf(null, t, S().year).length;
          const pct = exp ? Math.min(100, Math.round(done / exp * 100)) : 0;
          return `<div class="coverage-cell">
            <div class="row" style="justify-content:space-between">
              <span class="row" style="gap:7px;font-size:12.5px;font-weight:500"><i style="width:8px;height:8px;border-radius:50%;background:${meta.color};display:block"></i>${meta.name}</span>
              <span class="tiny muted">${meta.cycleMonths === 0 ? 'كل أسبوع' : meta.cycleMonths === 1 ? 'كل شهر' : meta.cycleMonths === 4 ? 'كل ٤ أشهر' : 'كل سنة'}</span></div>
            <div class="row" style="margin-top:8px;gap:6px"><strong class="num" style="font-size:19px">${done}</strong><span class="tiny muted">من ${exp}</span></div>
            <div class="bar-track" style="margin-top:6px"><i class="${pct >= 90 ? 'good' : pct >= 70 ? 'warn' : 'low'}" style="width:${pct}%"></i></div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">سجل الزيارات</h3><p class="section-sub">${list.length} زيارة مطابقة</p></div>
        <div class="spacer"></div>
        <button class="btn btn-outline btn-sm no-print" data-action="export-csv" data-kind="visits">${icon('download', 15)} تصدير CSV</button></div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>رقم الزيارة</th><th>الفرع</th><th>النوع</th><th>التاريخ</th><th>المدقق</th><th>الدرجة</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${rows.length ? rows.map(a => {
          const b = branchById(a.branchId);
          return `<tr class="clickable" data-action="open-audit" data-id="${a.id}">
            <td class="num muted">${a.id}</td>
            <td><div class="strong">${esc(b.name)}</div><div class="sub">${esc(cityById(b.cityId).name)} · ${b.code}</div></td>
            <td><span class="chip ${a.surprise ? 'chip-warn' : 'chip-gold'}">${typeLabel(a)}</span></td>
            <td class="num">${fmtDate(a.date)}</td><td>${esc(a.auditor)}</td>
            <td><span class="score ${scoreClass(a.overall)}"><i class="dot"></i>${a.overall}%</span></td>
            <td>${a.status === 'مكتملة' ? '<span class="chip chip-ok"><i class="d"></i>مكتملة</span>' : '<span class="chip chip-warn"><i class="d"></i>متابعة</span>'}</td>
            <td style="text-align:end;color:#B4A896">${icon('chevron', 16)}</td></tr>`;
        }).join('') : `<tr><td colspan="8">${emptyState('لا توجد زيارات', 'غيّر التصفية أو أضف زيارة جديدة')}</td></tr>`}</tbody>
      </table></div>
      ${pagination(page, pages, list.length)}
    </section>

    <div class="note" style="margin-top:16px">${icon('clock', 16)}
      <span>دورة الزيارات: يومية للمتابعة السريعة، أسبوعية للمتابعة التشغيلية، شهرية للتقييم الشامل، فصلية كل أربعة أشهر، وسنوية شاملة تُصدر عنها تقارير الفروع.</span></div>`;
  };

  function pagination(page, pages, total) {
    if (pages <= 1) return '';
    return `<div class="pagination no-print"><span>${total} سجل</span><span class="spacer"></span>
      <button class="page-btn" data-action="page" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>${icon('chevron', 14)}</button>
      ${Array.from({ length: Math.min(pages, 7) }).map((_, i) => `<button class="page-btn ${page === i + 1 ? 'active' : ''}" data-action="page" data-page="${i + 1}">${i + 1}</button>`).join('')}
      <button class="page-btn" data-action="page" data-page="${page + 1}" ${page === pages ? 'disabled' : ''}>${icon('chevron', 14)}</button></div>`;
  }
  function emptyState(title, sub) {
    return `<div class="empty">${icon('file', 38)}<h4>${esc(title)}</h4><p class="small">${esc(sub)}</p></div>`;
  }

  /* ---------------- branches (tree) ---------------- */
  function bmExportDoc() {
    const f = ui.filters.bm;
    let list = db.audits.filter(a => a.kind === 'bm');
    if (scopeRegion()) list = list.filter(a => branchById(a.branchId).regionId === scopeRegion());
    if (f.type !== 'all') list = list.filter(a => a.type === f.type);
    if (f.branch !== 'all') list = list.filter(a => a.branchId === f.branch);
    if (f.q) list = list.filter(a => (branchById(a.branchId).name + a.auditor + a.id).includes(f.q.trim()));
    list.sort((a, b) => b.date.localeCompare(a.date));
    const avg = list.length ? Math.round(list.reduce((t, a) => t + a.overall, 0) / list.length) : 0;
    const rows = list.map((a, i) => {
      const b = branchById(a.branchId);
      return `<tr><td>${i + 1}</td><td>${esc(a.id)}</td><td>${esc(b.name)}</td><td>${esc(regionById(b.regionId).name)}</td><td>${esc(cityById(b.cityId).name)}</td><td>${esc(typeName(a.type))}</td><td>${fmtDate(a.date)}</td><td>${a.overall}%</td></tr>`;
    }).join('');
    return `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>تقييمات مدراء الفروع</title>
    <style>body{font-family:"Tajawal","Segoe UI",Arial,sans-serif;padding:24px;color:#2b1a12}
    h1{font-size:20px;margin:0 0 4px}h2{font-size:13px;font-weight:400;color:#6b5b4b;margin:0 0 16px}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th,td{border:1px solid #c9b896;padding:6px 8px;text-align:right}
    th{background:#f4ecdd;font-weight:700}
    .ft{margin-top:18px;font-size:11px;color:#7b6a58}</style></head><body>
    <h1>شركة سنام الرائدة — نظام الجودة</h1>
    <h2>تقييمات مدراء الفروع · ${list.length} تقييم · المعدل العام ${avg}%</h2>
    <table><thead><tr><th>#</th><th>الرقم</th><th>الفرع</th><th>المنطقة</th><th>المدينة</th><th>النوع</th><th>التاريخ</th><th>الدرجة</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="8">لا توجد تقييمات</td></tr>'}</tbody></table>
    <div class="ft">تاريخ التصدير: ${fmtDate(TODAY_ISO())} — ${esc(S().website || 'snam.dellini.net')}</div>
    </body></html>`;
  }

  function exportBM(fmt) {
    const html = bmExportDoc();
    if (fmt === 'word') {
      const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'تقييمات-مدراء-الفروع-' + TODAY_ISO() + '.doc';
      document.body.appendChild(a); a.click(); a.remove();
      toast('تم تنزيل ملف Word');
      return;
    }
    const w = window.open('', '_blank');
    if (!w) { toast('امنع حاجب النوافذ ثم أعد المحاولة', 'err'); return; }
    w.document.write(html); w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  }

  VIEWS.bmvisits = function () {
    const f = ui.filters.bm;
    let list = db.audits.filter(a => a.kind === 'bm');
    if (scopeRegion()) list = list.filter(a => branchById(a.branchId).regionId === scopeRegion());
    if (f.type !== 'all') list = list.filter(a => a.type === f.type);
    if (f.branch !== 'all') list = list.filter(a => a.branchId === f.branch);
    if (f.q) list = list.filter(a => (branchById(a.branchId).name + a.auditor + a.id).includes(f.q.trim()));
    list.sort((a, b) => b.date.localeCompare(a.date));
    const avg = list.length ? Math.round(list.reduce((t, a) => t + a.overall, 0) / list.length) : 0;
    const best = list.slice().sort((a, b) => b.overall - a.overall)[0];
    const worst = list.slice().sort((a, b) => a.overall - b.overall)[0];
    const rows = list.map(a => {
      const b = branchById(a.branchId);
      return `<tr>
        <td class="num" dir="ltr">${esc(a.id)}</td>
        <td><b>${esc(b.name)}</b><div class="tiny muted">${esc(regionById(b.regionId).name)} · ${esc(cityById(b.cityId).name)}</div></td>
        <td>${esc(typeName(a.type))}</td>
        <td class="num">${fmtDate(a.date)}</td>
        <td class="num"><b>${a.overall}%</b></td>
        <td><span class="chip ${a.overall >= 85 ? 'chip-ok' : a.overall >= 70 ? 'chip-warn' : 'chip-bad'}">${a.overall >= 85 ? 'اجتياز' : a.overall >= 70 ? 'تحت المتابعة' : 'غير مطابق'}</span></td>
        <td><a class="btn btn-outline btn-sm" href="#/audit/${esc(a.id)}" data-nav="audit">فتح</a></td>
      </tr>`;
    }).join('');

    return `
    ${draftBanner()}
    <div class="toolbar no-print">
      <div class="seg">
        ${['all', ...BM_TYPES].map(t => `<button class="${f.type === t ? 'active' : ''}" data-action="bmtype" data-type="${t}">${t === 'all' ? 'الكل' : typeName(t)}</button>`).join('')}
      </div>
      <div class="spacer"></div>
      <div class="field" style="min-width:190px">
        <select class="select" data-filter="bm.branch">
          <option value="all">كل الفروع</option>
          ${scopeBranches().map(b => `<option value="${b.id}" ${f.branch === b.id ? 'selected' : ''}>${esc(branchLabel(b))}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:170px">
        <input class="input" placeholder="بحث…" value="${esc(f.q)}" data-search="bm.q"></div>
      ${isEditor() ? `<button class="btn btn-primary" data-action="new-bm-visit">${icon('plus', 16)} تقييم جديد</button>` : ''}
      <button class="btn btn-outline" data-action="bm-export" data-fmt="word">${icon('file', 16)} Word</button>
      <button class="btn btn-outline" data-action="bm-export" data-fmt="pdf">${icon('download', 16)} PDF</button>
      <button class="btn btn-outline" data-action="bm-export" data-fmt="print">${icon('print', 16)} طباعة</button>
    </div>

    <div class="kpis">
      ${kpi('عدد التقييمات', list.length, '', 'shield', 'تقييم', '', '')}
      ${kpi('المعدل العام', avg, '%', 'target', '', avg >= 85 ? 'up' : 'down', scoreClass(avg))}
      ${kpi('أعلى فرع', best ? best.overall : 0, '%', 'star', best ? branchById(best.branchId).name : 'لا بيانات', '', 'good')}
      ${kpi('أدنى فرع', worst ? worst.overall : 0, '%', 'alert', worst ? branchById(worst.branchId).name : 'لا بيانات', '', 'bad')}
    </div>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">تقييمات مدراء الفروع</h3>
        <p class="section-sub">${list.length} تقييم — أسبوعي · شهري · سنوي</p></div></div>
      <div class="card-body" style="padding:0">
        ${list.length ? `<div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>الرقم</th><th>الفرع</th><th>النوع</th><th>التاريخ</th><th>الدرجة</th><th>التقدير</th><th></th></tr></thead>
          <tbody>${rows}</tbody></table></div>` : emptyState('لا توجد تقييمات بعد', 'ابدأ بتقييم مدير فرع')}
      </div>
    </section>`;
  };

  VIEWS.branches = function () {
    const f = ui.filters.branches;
    const regions = db.regions.slice().sort((a, b) => a.order - b.order).filter(r => !scopeRegion() || r.id === scopeRegion());
    const rOpen = id => (treeOpen['r:' + id] !== undefined ? !!treeOpen['r:' + id] : (scopeRegion() === id || !!f.q));
    const cOpen = id => (treeOpen['c:' + id] !== undefined ? !!treeOpen['c:' + id] : !!f.q);

    return `
    <div class="toolbar no-print">
      <div class="seg">
        <button class="${f.region === 'all' ? 'active' : ''}" data-action="rfilter" data-region="all">كل المناطق</button>
        ${regions.map(r => `<button class="${f.region === r.id ? 'active' : ''}" data-action="rfilter" data-region="${r.id}">${r.name}</button>`).join('')}
      </div>
      <div class="field" style="min-width:200px">
        <input class="input" placeholder="ابحث باسم الفرع أو المدينة أو المدير…" value="${esc(f.q || '')}" data-search="branches.q">
      </div>
      <div class="spacer"></div>
      <span class="chip chip-muted">${db.branches.length} فرع · ${db.cities.length} مدينة</span>
      <button class="btn btn-outline" data-action="export-csv" data-kind="branches">${icon('download', 16)} تصدير</button>
    </div>

    ${regions.filter(r => f.region === 'all' || f.region === r.id).map(r => {
      const q = (f.q || '').trim();
      const match = b => !q || (b.name + cityById(b.cityId).name + b.manager + b.code).includes(q);
      const cities = db.cities.filter(c => c.regionId === r.id).filter(c => !q || c.name.includes(q) || branchesOfCity(c.id).some(match));
      const rb = branchesOfRegion(r.id);
      if (q && !cities.length) return '';
      const score = avgScore(rb.flatMap(b => auditsOf(b.id, null, S().year)));
      const open = findingsOf(null).filter(x => x.status !== 'مغلق' && rb.some(b => b.id === x.branchId)).length;
      return `<section class="card region-card" style="margin-bottom:16px">
        <div class="region-head ${rOpen(r.id) ? '' : 'is-collapsed'}" data-action="toggle-region" data-region="${r.id}" role="button" tabindex="0">
          <span class="tree-chev ${rOpen(r.id) ? 'open' : ''}">${icon('chevron', 16)}</span>
          <div class="region-badge" style="background:${r.color}">${icon('pin', 18)}</div>
          <div style="min-width:0">
            <h3 class="section-title">المنطقة ${r.name}</h3>
            <p class="section-sub">${cities.length} مدن · ${rb.length} فرع · ${open} ملاحظة مفتوحة</p>
          </div>
          <div class="spacer"></div>
          <span class="chip ${scoreClass(score) === 'good' ? 'chip-ok' : scoreClass(score) === 'warn' ? 'chip-warn' : 'chip-bad'}">امتثال ${score}%</span>
          ${isEditor() ? `<button class="btn btn-outline btn-sm" data-action="add-city" data-region="${r.id}">${icon('plus', 14)} مدينة</button>` : ''}
        </div>
        <div class="region-body ${rOpen(r.id) ? '' : 'is-hidden'}">
          ${cities.map(c => {
            const q = (f.q || '').trim();
            const bs = branchesOfCity(c.id).filter(b => !q || (b.name + cityById(b.cityId).name + b.manager + b.code).includes(q) || c.name.includes(q));
            return `<div class="city-block">
              <div class="city-head ${cOpen(c.id) ? '' : 'is-collapsed'} ${c.active === false ? 'row-off' : ''}" data-action="toggle-city" data-city="${c.id}" role="button" tabindex="0">
                <span class="tree-chev sm ${cOpen(c.id) ? 'open' : ''}">${icon('chevron', 12)}</span>
                <span class="city-name">${esc(c.name)}</span>
                ${c.active === false ? '<span class="chip chip-muted" style="font-size:9.5px">موقوفة</span>' : ''}
                <span class="tiny muted">${bs.length} فرع</span>
                <div class="spacer"></div>
                ${isAdmin() ? `<button class="icon-btn sm" data-action="edit-city" data-city="${c.id}" title="تعديل المدينة">${icon('edit', 12)}</button>` : ''}
                ${isAdmin() ? `<button class="icon-btn sm" data-action="toggle-city-active" data-city="${c.id}" title="${c.active === false ? 'تفعيل' : 'إيقاف'}">${c.active === false ? icon('check', 12) : icon('x', 12)}</button>` : ''}
                ${isAdmin() ? `<button class="icon-btn sm" data-action="delete-city" data-city="${c.id}" title="حذف المدينة">${icon('trash', 12)}</button>` : ''}
                ${isEditor() ? `<button class="btn btn-ghost btn-sm city-add" data-action="add-branch" data-city="${c.id}">${icon('plus', 13)} فرع</button>` : ''}
              </div>
              <div class="city-body ${cOpen(c.id) ? '' : 'is-hidden'}">
              ${bs.length ? `<div class="branch-grid">
                ${bs.map(b => {
                  const list = auditsOf(b.id, null, S().year);
                  const sc = avgScore(list);
                  const op = findingsOf(b.id).filter(x => x.status !== 'مغلق').length;
                  const last = [...list].sort((x, y) => y.date.localeCompare(x.date))[0];
                  return `<div class="branch-tile" data-action="open-branch" data-id="${b.id}">
                    <div class="row" style="align-items:flex-start;gap:10px">
                      <div class="branch-ico">${icon('store', 16)}</div>
                      <div style="min-width:0;flex:1">
                        <div class="strong" style="font-size:13px">${esc(b.name)}</div>
                        <div class="tiny muted">${b.code} · ${esc(b.manager)}</div>
                      </div>
                      <span class="chip ${sc >= S().passScore ? 'chip-ok' : sc >= S().warnScore ? 'chip-warn' : 'chip-bad'}">${sc}%</span>
                    </div>
                    <div class="branch-meta">
                      <span>${last ? 'آخر زيارة ' + fmtShort(last.date) : 'لا زيارات'}</span>
                      <span>${op ? op + ' ملاحظة' : 'سليم'}</span>
                    </div>
                  </div>`;
                }).join('')}
              </div>` : `<div class="city-empty">لا توجد فروع في هذه المدينة — <button class="link-btn" data-action="add-branch" data-city="${c.id}">أضف فرعًا</button></div>`}
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}`;
  };

  /* ---------------- findings ---------------- */
  VIEWS.findings = function () {
    const f = ui.filters.findings;
    let list = db.findings.slice();
    if (f.status !== 'all') list = list.filter(x => x.status === f.status);
    if (f.severity !== 'all') list = list.filter(x => x.severity === f.severity);
    if (f.branch !== 'all') list = list.filter(x => x.branchId === f.branch);
    if (f.q) list = list.filter(x => (x.title + branchById(x.branchId).name + x.id).includes(f.q.trim()));
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const counts = {
      all: db.findings.length,
      'مفتوح': findingsOf(null, 'مفتوح').length,
      'قيد المعالجة': findingsOf(null, 'قيد المعالجة').length,
      'مغلق': findingsOf(null, 'مغلق').length
    };
    const perPage = 8, pages = Math.max(1, Math.ceil(list.length / perPage));
    const page = Math.min(ui.page, pages);
    const rows = list.slice((page - 1) * perPage, page * perPage);
    const sevChip = s => s === 'حرج' ? 'chip-bad' : s === 'عالي' ? 'chip-warn' : 'chip-gold';
    const stChip = s => s === 'مغلق' ? 'chip-ok' : s === 'قيد المعالجة' ? 'chip-info' : 'chip-warn';

    return `
    <div class="tabs no-print">
      ${['all', 'مفتوح', 'قيد المعالجة', 'مغلق'].map(s => `<button class="tab ${f.status === s ? 'active' : ''}" data-action="fstatus" data-status="${s}">${s === 'all' ? 'الكل' : s}<span class="n">${counts[s]}</span></button>`).join('')}
    </div>
    <div class="toolbar no-print">
      <div class="field" style="min-width:200px">
        <select class="select" data-filter="findings.branch"><option value="all">كل الفروع</option>
          ${db.branches.map(b => `<option value="${b.id}" ${f.branch === b.id ? 'selected' : ''}>${esc(branchLabel(b))}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:140px">
        <select class="select" data-filter="findings.severity"><option value="all">كل الدرجات</option>
          ${['حرج', 'عالي', 'متوسط'].map(s => `<option value="${s}" ${f.severity === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:190px"><input class="input" placeholder="بحث…" value="${esc(f.q)}" data-search="findings.q"></div>
      <div class="spacer"></div>
      <button class="btn btn-outline" data-action="export-csv" data-kind="findings">${icon('download', 16)} تصدير</button>
    </div>
    <section class="card">
      <div class="card-head"><div><h3 class="section-title">سجل الملاحظات</h3><p class="section-sub">${list.length} ملاحظة</p></div></div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>الملاحظة</th><th>الفرع</th><th>الخطورة</th><th>المسؤول</th><th>الاستحقاق</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${rows.length ? rows.map(x => {
          const b = branchById(x.branchId);
          const overdue = x.status !== 'مغلق' && x.due < '2026-11-06';
          return `<tr class="clickable" data-action="open-finding" data-id="${x.id}">
            <td><div class="strong" style="max-width:320px">${esc(x.title)}</div><div class="sub">${x.id} · ${esc(x.sectionName)}</div></td>
            <td><div>${esc(b.name)}</div><div class="sub">${esc(cityById(b.cityId).name)}</div></td>
            <td><span class="chip ${sevChip(x.severity)}">${x.severity}</span></td>
            <td>${esc(x.owner)}</td>
            <td class="num" style="${overdue ? 'color:var(--bad);font-weight:600' : 'color:var(--muted)'}">${fmtDate(x.due)}</td>
            <td><span class="chip ${stChip(x.status)}"><i class="d"></i>${x.status}</span></td>
            <td style="text-align:end;color:#B4A896">${icon('chevron', 16)}</td></tr>`;
        }).join('') : `<tr><td colspan="7">${emptyState('لا توجد ملاحظات', 'غيّر التصفية')}</td></tr>`}</tbody>
      </table></div>
      ${pagination(page, pages, list.length)}
    </section>`;
  };

  /* ---------------- form builder ---------------- */
  VIEWS.form = function () {
    ui.editBm = false;
    const total = totalActiveItems();
    return `
    <div class="toolbar no-print">
      <div class="chip chip-gold">${total} بندًا مفعّلًا</div>
      <div class="chip chip-muted">الدرجة النهائية ${TOTAL_POINTS}</div>
      <div class="spacer"></div>
      ${canEditForms() ? `<button class="btn btn-outline" data-action="add-section">${icon('plus', 16)} محور جديد</button>` : ''}
      ${canEditForms() ? `<button class="btn btn-primary" data-action="save-forms">${icon('check', 16)} حفظ الاستمارة</button>` : ''}
    </div>
    ${db.sections.slice().sort((a, b) => a.order - b.order).map((s, idx) => {
      const a = activeItems(s).length;
      return `<section class="card" style="margin-bottom:12px">
        <div class="card-head" style="align-items:center">
          <div class="kpi-icon" style="background:#F7F1E3;color:#8A7434;font-weight:600">${idx + 1}</div>
          <div><h3 class="section-title">${esc(s.name)}</h3>
            <p class="section-sub">${a} من ${s.items.length} بندًا مفعّلًا${s.group ? ' · ' + esc(s.group) : ''}</p></div>
          <div class="spacer"></div>
          ${canEditForms() ? `<button class="btn btn-outline btn-sm" data-action="add-item" data-section="${s.id}">${icon('plus', 13)} بند</button>` : ''}
          ${canEditForms() ? `<button class="btn btn-outline btn-sm" data-action="delete-section" data-section="${s.id}">${icon('trash', 13)}</button>` : ''}
        </div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th style="width:44px">#</th><th>البند</th><th style="width:80px">الدرجة</th><th style="width:120px">الحالة</th><th style="width:96px"></th></tr></thead>
          <tbody>${s.items.map((it, i) => `<tr class="${it.active === false ? 'row-off' : ''}">
            <td class="num muted">${i + 1}</td>
            <td><div class="strong" style="font-size:12.5px">${esc(it.text)}</div></td>
            <td class="num">${isPhotoItem(it) ? '<span class="chip chip-muted">صور</span>' : it.max}</td>
            <td><button class="switch ${it.active === false ? '' : 'on'}" data-action="toggle-item" data-item="${it.id}"><i></i><span>${it.active === false ? 'متوقف' : 'مفعّل'}</span></button></td>
            <td class="row" style="justify-content:flex-end;gap:4px">
              <button class="icon-btn sm" data-action="edit-item" data-item="${it.id}">${icon('edit', 14)}</button>
              <button class="icon-btn sm" data-action="delete-item" data-item="${it.id}">${icon('trash', 14)}</button>
            </td></tr>`).join('')}</tbody>
        </table></div>
      </section>`;
    }).join('')}`;
  };

  /* ---------------- reports ---------------- */
  function reportRange() {
    const f = ui.filters.report;
    const mode = f.mode || 'monthly';
    const year = Number(f.year) || S().year;
    let from, to;
    if (mode === 'weekly') {
      from = f.from || TODAY_ISO();
      to = f.to || from;
    } else if (mode === 'monthly') {
      const m = f.month == null ? TODAY.getMonth() : Number(f.month);
      const last = new Date(year, m + 1, 0).getDate();
      from = f.from || `${year}-${pad(m + 1)}-01`;
      to = f.to || `${year}-${pad(m + 1)}-${pad(last)}`;
    } else {
      from = `${year}-01-01`;
      to = `${year}-12-31`;
    }
    return { from: from <= to ? from : to, to: from <= to ? to : from, mode, year };
  }


  /* ---------------- تحليل التقارير ---------------- */
  VIEWS['form-bm'] = function () {
    ui.editBm = true;
    const secs = (db.bmSections && db.bmSections.length ? db.bmSections : BM_SECTIONS).slice().sort((a, b) => a.order - b.order);
    const total = secs.reduce((n, s) => n + scoredItems(s).length, 0);
    return `
    <div class="toolbar no-print">
      <div class="chip chip-gold">${total} بندًا مفعّلًا</div>
      <div class="chip chip-muted">الدرجة النهائية 150</div>
      <div class="spacer"></div>
      ${canEditForms() ? `<button class="btn btn-outline" data-action="add-section">${icon('plus', 16)} محور جديد</button>` : ''}
      ${canEditForms() ? `<button class="btn btn-primary" data-action="save-forms">${icon('check', 16)} حفظ الاستمارة</button>` : ''}
      ${canCreateInv() ? `<button class="btn btn-gold" data-action="new-bm-visit">${icon('plus', 16)} تقييم جديد</button>` : ''}
    </div>
    ${secs.map((s, idx) => {
      const a = activeItems(s).length;
      return `<section class="card" style="margin-bottom:12px">
        <div class="card-head" style="align-items:center">
          <div class="kpi-icon" style="background:#F7F1E3;color:#8A7434;font-weight:600">${idx + 1}</div>
          <div><h3 class="section-title">${esc(s.name)}</h3>
            <p class="section-sub">${a} من ${s.items.length} بندًا مفعّلًا · ${s.items.filter(x => x.active !== false).reduce((n, x) => n + (Number(x.max) || 0), 0)} درجة</p></div>
          <div class="spacer"></div>
          ${isEditor() ? `<button class="btn btn-outline btn-sm" data-action="add-item" data-section="${s.id}">${icon('plus', 13)} بند</button>` : ''}
          ${isEditor() ? `<button class="btn btn-outline btn-sm" data-action="delete-section" data-section="${s.id}">${icon('trash', 13)}</button>` : ''}
        </div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th style="width:44px">#</th><th>البند</th><th style="width:80px">الدرجة</th><th style="width:120px">الحالة</th><th style="width:96px"></th></tr></thead>
          <tbody>${s.items.map((it, i) => `<tr class="${it.active === false ? 'row-off' : ''}">
            <td class="num muted">${i + 1}</td>
            <td><div class="strong" style="font-size:12.5px">${esc(it.text)}</div></td>
            <td class="num">${it.max}</td>
            <td><button class="switch ${it.active === false ? '' : 'on'}" data-action="toggle-item" data-item="${it.id}"><i></i><span>${it.active === false ? 'متوقف' : 'مفعّل'}</span></button></td>
            <td class="row" style="justify-content:flex-end;gap:4px">
              <button class="icon-btn sm" data-action="edit-item" data-item="${it.id}">${icon('edit', 14)}</button>
              <button class="icon-btn sm" data-action="delete-item" data-item="${it.id}">${icon('trash', 14)}</button>
            </td></tr>`).join('')}</tbody>
        </table></div>
      </section>`;
    }).join('')}`;
  };

  /* ================= زيارة الجرد ================= */
  let iwiz = null;

  function invFieldHTML(it, val) {
    if (it.type === 'bool') return `<select class="select" data-inv="${it.id}">
      <option value="">—</option>
      <option value="نعم" ${val === 'نعم' ? 'selected' : ''}>نعم</option>
      <option value="لا" ${val === 'لا' ? 'selected' : ''}>لا</option></select>`;
    if (it.type === 'select') return `<select class="select" data-inv="${it.id}"><option value="">—</option>
      ${(it.options || []).map(o => `<option ${val === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    const t = it.type === 'money' ? 'number' : it.type === 'time' ? 'time' : 'text';
    return `<input class="input" type="${t}" ${t === 'number' ? 'step="0.01"' : ''} data-inv="${it.id}" value="${esc(val == null ? '' : val)}">`;
  }

  function invItemExtras(it) {
    const note = (iwiz.notes && iwiz.notes[it.id]) || '';
    const files = (iwiz.attach && iwiz.attach[it.id]) || [];
    return `<div class="inv-extras">
      <div class="wi-note-row" style="margin-top:6px">
        <input class="wi-note" data-invnote="${it.id}" placeholder="ملاحظة على هذا البند…" value="${esc(note)}">
        <button type="button" class="mic-btn" data-action="dictate" data-target='[data-invnote="${it.id}"]' title="كتابة صوتية">${icon('mic', 14)}</button>
      </div>
      <div class="row" style="gap:6px;margin-top:6px;align-items:center;flex-wrap:wrap">
        <label class="photo-btn" title="صورة من الجهاز أو الكاميرا">${icon('camera', 15)}
          <input type="file" accept="image/*" capture="environment" data-invimg="${it.id}" hidden></label>
        <label class="photo-btn" title="إرفاق ملف PDF">${icon('file', 15)}
          <input type="file" accept="application/pdf" data-invpdf="${it.id}" hidden></label>
        ${files.map((f, i) => f.kind === 'pdf'
          ? `<a class="chip chip-gold" href="${f.url}" target="_blank" rel="noopener">PDF ${i + 1}</a>
             <button type="button" class="icon-btn sm" data-action="inv-del-file" data-item="${it.id}" data-idx="${i}">${icon('x', 12)}</button>`
          : `<span class="ip"><img src="${f.url}" alt=""><button type="button" class="ip-x" data-action="inv-del-file" data-item="${it.id}" data-idx="${i}">${icon('x', 10)}</button></span>`).join('')}
      </div>
    </div>`;
  }

  function invFormHTML() {
    const secs = (db.invSections && db.invSections.length ? db.invSections : INV_SECTIONS).filter(x => x.active !== false).sort((a, b) => a.order - b.order);
    return secs.map((sec, si) => `
      <section class="card" style="margin-bottom:12px">
        <div class="card-head"><div><h3 class="section-title">${si + 1}. ${esc(sec.name)}</h3></div></div>
        <div class="card-body">
          ${(sec.items || []).filter(it => it.active !== false).length ? `<div class="form-grid">
            ${(sec.items || []).filter(it => it.active !== false).map(it => `<div class="field"><label>${esc(it.text)}</label>
              ${invFieldHTML(it, iwiz.data[it.id])}
              ${invItemExtras(it)}</div>`).join('')}
          </div>` : ''}
          ${sec.rows ? `<div class="tbl-wrap" style="margin-top:12px"><table class="tbl compact">
            <thead><tr>${sec.cols.map(c => `<th>${esc(c)}</th>`).join('')}<th style="width:44px"></th></tr></thead>
            <tbody>${(iwiz.rows[sec.id] || []).map((row, ri) => `<tr>
              ${sec.cols.map((c, ci) => `<td><input class="input" style="min-width:90px" data-invrow="${sec.id}|${ri}|${ci}" value="${esc(row[ci] || '')}"></td>`).join('')}
              <td><button type="button" class="icon-btn sm" data-action="inv-del-row" data-sec="${sec.id}" data-row="${ri}">${icon('trash', 14)}</button></td>
            </tr>`).join('')}</tbody></table></div>
            <button type="button" class="btn btn-outline btn-sm" style="margin-top:8px" data-action="inv-add-row" data-sec="${sec.id}">${icon('plus', 14)} صف جديد</button>` : ''}
        </div>
      </section>`).join('');
  }

  function invHeaderHTML() {
    const reg = regionById(iwiz.regionId);
    const cities = db.cities.filter(c => c.regionId === iwiz.regionId);
    const branches = db.branches.filter(b => b.cityId === iwiz.cityId);
    return `<div class="form-grid" style="margin-bottom:12px">
      <div class="field"><label>المنطقة</label>${isAdmin()
        ? `<select class="select" data-invregion>${db.regions.map(r => `<option value="${r.id}" ${r.id === iwiz.regionId ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select>`
        : `<input class="input" value="${esc(reg.name)}" disabled>`}</div>
      <div class="field"><label>المدينة</label><select class="select" data-invcity>
        ${cities.map(c => `<option value="${c.id}" ${c.id === iwiz.cityId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>الفرع</label><select class="select" data-invbranch>
        ${branches.map(b => `<option value="${b.id}" ${b.id === iwiz.branchId ? 'selected' : ''}>${esc(b.name)} (${b.code})</option>`).join('')}</select></div>
      <div class="field"><label>التاريخ</label><input class="input" type="date" data-invdate value="${iwiz.date}"></div>
      <div class="field full"><label class="row" style="gap:8px"><input type="checkbox" data-invsurprise ${iwiz.surprise ? 'checked' : ''}> زيارة مفاجأة (بدون إشعار مسبق)</label></div>
    </div>`;
  }

  function invWizard(auditId) {
    const a = auditId ? db.audits.find(x => x.id === auditId) : null;
    const me = currentUser() || {};
    const reg = scopeRegion() || (me.regionId && me.regionId !== 'all' ? me.regionId : 'r-south');
    const firstCity = defaultCityFor(reg);
    const firstBranch = (db.branches.find(b => b.cityId === firstCity) || db.branches[0] || {});
    if (!a && !canCreateInv()) { toast('غير مصرح بإنشاء زيارة جرد', 'err'); return; }
    iwiz = a ? {
      id: a.id, branchId: a.branchId, regionId: branchById(a.branchId).regionId, cityId: branchById(a.branchId).cityId,
      date: a.date, surprise: !!a.surprise, visitTime: a.visitTime || '', data: JSON.parse(JSON.stringify(a.data || {})),
      rows: JSON.parse(JSON.stringify(a.rows || {})), notes: JSON.parse(JSON.stringify(a.notes || {})), attach: JSON.parse(JSON.stringify(a.attach || {}))
    } : {
      id: null, regionId: reg, cityId: firstCity, branchId: firstBranch.id,
      date: TODAY_ISO(), surprise: false, data: {}, rows: {}, notes: {}, attach: {}
    };
    if (!iwiz.data['inv1-1'] && me.name) iwiz.data['inv1-1'] = me.name;
    if (!iwiz.data['inv1-2']) iwiz.data['inv1-2'] = branchById(iwiz.branchId).manager || '';
    openModal(`<div class="modal-head">
        <div><h2>${a ? 'تعديل زيارة جرد — ' + a.id : 'زيارة جرد جديدة'}</h2>
          <p>${esc(branchLabel(branchById(iwiz.branchId)))}</p></div>
        <button class="close-x" data-action="close-inv">${icon('x', 16)}</button></div>
      <div class="modal-body" id="invBody">
        ${invHeaderHTML()}
        ${invFormHTML()}
      </div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-inv">إلغاء</button>
        <button class="btn btn-primary" data-action="inv-save">${icon('check', 15)} حفظ زيارة الجرد</button></div>`, { size: 'full' });
  }

  function invCapture() {
    if (!iwiz) return;
    const br = qs('[data-invbranch]'); if (br) iwiz.branchId = br.value;
    const ct = qs('[data-invcity]'); if (ct) iwiz.cityId = ct.value;
    const d = qs('[data-invdate]'); if (d) iwiz.date = d.value || TODAY_ISO();
    const sp = qs('[data-invsurprise]'); if (sp) iwiz.surprise = sp.checked;
    qsa('[data-inv]').forEach(el => { iwiz.data[el.dataset.inv] = el.value; });
    qsa('[data-invnote]').forEach(el => { iwiz.notes[el.dataset.invnote] = el.value; });
    qsa('[data-invrow]').forEach(el => {
      const [sec, ri, ci] = el.dataset.invrow.split('|');
      iwiz.rows[sec] = iwiz.rows[sec] || [];
      iwiz.rows[sec][Number(ri)] = iwiz.rows[sec][Number(ri)] || [];
      iwiz.rows[sec][Number(ri)][Number(ci)] = el.value;
    });
  }

  async function invAddFile(input) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const itemId = input.dataset.invimg || input.dataset.invpdf;
    const isPdf = !!input.dataset.invpdf;
    invCapture();
    for (const file of files) {
      if (isPdf) {
        if (file.size > 6 * 1024 * 1024) { toast('ملف PDF أكبر من 6 ميجا', 'err'); continue; }
        const url = await uploadBlob(file, 'pdf');
        if (url) { iwiz.attach[itemId] = iwiz.attach[itemId] || []; iwiz.attach[itemId].push({ kind: 'pdf', url, name: file.name }); }
        else toast('تعذّر رفع الملف', 'err');
      } else {
        const dataUrl = await new Promise(res => { const fr = new FileReader(); fr.onload = e => res(e.target.result); fr.readAsDataURL(file); });
        const small = await shrinkImage(dataUrl, 780, 0.45);
        iwiz.attach[itemId] = iwiz.attach[itemId] || [];
        iwiz.attach[itemId].push({ kind: 'img', url: small });
      }
    }
    qs('#invBody').innerHTML = invHeaderHTML() + invFormHTML();
  }

  async function uploadBlob(blob, ext) {
    try {
      const h = await sbAuthHeaders(); if (!h) return null;
      const buf = new Uint8Array(await blob.arrayBuffer());
      let hash = 0; for (let i = 0; i < buf.length; i += 97) hash = (hash * 31 + buf[i]) >>> 0;
      const name = 'd' + hash.toString(36) + buf.length.toString(36) + '.' + ext;
      const r = await fetch(SB_URL + '/storage/v1/object/photos/' + name, {
        method: 'POST', headers: { ...h, 'Content-Type': blob.type || 'application/octet-stream', 'x-upsert': 'true' }, body: buf
      });
      if (!r.ok) return null;
      return SB_URL + '/storage/v1/object/public/photos/' + name;
    } catch (e) { return null; }
  }

  function shrinkImage(dataUrl, max, q) {
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > max || h > max) { const r = Math.min(max / w, max / h); w = Math.round(w * r); h = Math.round(h * r); }
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        res(cv.toDataURL('image/jpeg', q));
      };
      img.onerror = () => res(dataUrl);
      img.src = dataUrl;
    });
  }

  function invSave() {
    invCapture();
    if (!iwiz.branchId) { toast('اختر الفرع', 'err'); return; }
    const id = iwiz.id || 'INV-' + String(db.audits.filter(a => a.kind === 'inv').length + 1).padStart(4, '0');
    const audit = {
      id, kind: 'inv', type: 'inventory', branchId: iwiz.branchId, regionId: iwiz.regionId, date: iwiz.date, surprise: !!iwiz.surprise,
      data: { ...iwiz.data }, rows: JSON.parse(JSON.stringify(iwiz.rows || {})),
      notes: JSON.parse(JSON.stringify(iwiz.notes || {})), attach: JSON.parse(JSON.stringify(iwiz.attach || {})),
      auditor: iwiz.data['inv1-1'] || (currentUser() || {}).name || '',
      status: 'مكتملة', overall: null, approval: 'draft',
      authorName: (currentUser() || {}).name || iwiz.data['inv1-1'] || '',
      authorRole: (currentUser() || {}).role || '',
      visitTime: iwiz.visitTime || clockNow(),
      createdBy: (currentUser() || {}).username || '', createdAt: TODAY_ISO(), updatedAt: new Date().toISOString()
    };
    if (iwiz.id) db.audits = db.audits.map(x => x.id === id ? audit : x);
    else db.audits.unshift(audit);
    save(); iwiz = null; closeModal();
    ui.filters.auditId = id; ui.route = 'audit';
    toast('تم حفظ زيارة الجرد ' + id); render();
  }

  function invReport(a) {
    const b = branchById(a.branchId);
    const secs = (db.invSections && db.invSections.length ? db.invSections : INV_SECTIONS).slice().sort((x, y) => x.order - y.order);
    const sg = a.signatures || {};
    const meRole = (currentUser() || {}).role || '';
    const opsUser = db.users.find(u => u.role === 'ops_manager' && (u.regionId === b.regionId || u.regionId === 'all'));
    const ceoUser = db.users.find(u => u.role === 'ceo' && u.active !== false);
    const approved = a.approval === 'approved';
    const sigCell = (title, s0, fallback, pendingText) => `<div>${title}<br><span>${esc(s0.by || fallback || '—')}</span>${s0.img ? `<img class="sig-img" src="${s0.img}" alt="">` : ''}<div class="tiny muted" style="margin-top:4px">${s0.at ? fmtDate(s0.at) : pendingText}</div></div>`;

    return `
    <div class="toolbar no-print">
      <button class="btn btn-outline" data-action="back-inv">${icon('arrowRight', 16)} رجوع</button>
      <div class="spacer"></div>
      ${canEditVisit(a) && !approved ? `<button class="btn btn-outline" data-action="edit-inv" data-id="${a.id}">${icon('edit', 16)} تعديل</button>` : ''}
      <button class="btn btn-outline" data-action="word-inv" data-id="${a.id}">${icon('file', 16)} Word</button>
      <button class="btn btn-outline" data-action="pdf-inv">${icon('download', 16)} تحميل PDF</button>
      <button class="btn btn-primary" data-action="print-inv">${icon('print', 16)} طباعة التقرير</button>
    </div>

    <div class="approval-bar no-print">
      ${approved
        ? `<span class="chip chip-ok">${icon('check', 13)} معتمد ومختوم${a.sealedBy ? ' — ' + esc(a.sealedBy) : ''}</span>`
        : `<span class="chip chip-muted">${esc(STAGE_LABEL(a))}</span>`}
      <div class="spacer"></div>
      ${isQM() && (!a.approval || a.approval === 'draft') ? `<button class="btn btn-primary btn-sm" data-action="send-ops" data-id="${a.id}">${icon('upload', 15)} توقيع وإرسال للاعتماد</button>` : ''}
      ${meRole === 'ops_manager' && ['pending_ops', 'pending_ceo', 'pending_final'].includes(a.approval) ? `<button class="btn btn-gold btn-sm" data-action="ops-approve" data-id="${a.id}">${icon('shield', 15)} التوقيع والاعتماد النهائي</button>` : ''}
    </div>

    <article class="card report-sheet" id="auditReport">
      <header class="report-head">
        <img src="${esc(S().logo)}" class="report-logo" alt="سنام">
        <div style="flex:1">
          <div class="tiny muted" style="letter-spacing:1px">${esc(S().serviceName)}</div>
          <h2>${a.surprise ? 'تقرير زيارة جرد مفاجأة' : 'تقرير زيارة جرد'}</h2>
          <p class="small muted">${esc(S().companyName)} — ${esc(S().tagline)}</p>
        </div>
      </header>

      <section class="report-meta">
        <div>
          <h3 style="font-size:16px;font-weight:600">${esc(b.name)}</h3>
          <table class="tbl" style="font-size:12.5px;margin-top:8px"><tbody>
            <tr><td class="muted" style="padding:5px 0;width:38%">المنطقة</td><td>${esc(regionById(b.regionId).name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">المدينة</td><td>${esc(cityById(b.cityId).name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">الفرع</td><td>${esc(b.name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">مدير الفرع</td><td>${esc(b.manager)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">كاتب التقرير</td><td>${esc(a.authorName || a.auditor || '—')}${a.authorRole ? ` <span class="tiny muted">(${a.authorRole === 'ops_manager' ? 'مدير التشغيل' : a.authorRole === 'quality_manager' ? 'مدير الجودة' : 'مسؤول'})</span>` : ''}</td></tr>
            <tr><td class="muted" style="padding:5px 0">نوع الزيارة</td><td>${a.surprise ? 'جرد — مفاجأة' : 'جرد'}</td></tr>
            <tr><td class="muted" style="padding:5px 0">رقم التقرير</td><td class="num" dir="ltr" style="text-align:start">${a.id}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الزيارة</td><td class="num">${fmtDate(a.date)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">وقت الزيارة</td><td class="num" dir="ltr">${visitTimeOf(a)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الاعتماد</td><td class="num">${approvalDateOf(a)}</td></tr>
          </tbody></table>
        </div>
        <div class="report-score">
          <div class="tiny muted">نوع النموذج</div>
          <div class="big-score" style="font-size:22px">جرد</div>
          <div class="chip chip-gold">بدون درجات</div>
        </div>
      </section>

      ${secs.map((sec, i) => {
        const has = it => (a.data && a.data[it.id] != null && a.data[it.id] !== '') || (a.notes && a.notes[it.id]) || (a.attach && (a.attach[it.id] || []).length);
        const fields = (sec.items || []).filter(it => it.active !== false && has(it));
        const rows = sec.rows ? ((a.rows || {})[sec.id] || []).filter(r => (r || []).some(v => v)) : [];
        if (!fields.length && !rows.length) return '';
        return `<section style="margin:14px 0">
          <h3 class="rep-h">${i + 1}. ${esc(sec.name)}</h3>
          ${fields.length ? `<table class="tbl bordered compact"><tbody>
            ${fields.map(it => {
              const files = (a.attach && a.attach[it.id]) || [];
              const note = (a.notes && a.notes[it.id]) || '';
              return `<tr><td class="muted" style="width:32%">${esc(it.text)}</td><td>
                <div>${esc(a.data[it.id] || '—')}</div>
                ${note ? `<div class="tiny" style="margin-top:4px;color:#6b5b4b">ملاحظة: ${esc(note)}</div>` : ''}
                ${files.length ? `<div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">${files.map(f => f.kind === 'pdf' ? `<a class="chip chip-gold" href="${f.url}" target="_blank" rel="noopener">PDF</a>` : `<img src="${f.url}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;border:1px solid #E5D7BE">`).join('')}</div>` : ''}
              </td></tr>`;
            }).join('')}
          </tbody></table>` : ''}
          ${rows.length ? `<div class="tbl-wrap"><table class="tbl compact bordered">
            <thead><tr>${sec.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>${rows.map(r => `<tr>${sec.cols.map((c, ci) => `<td>${esc(r[ci] || '')}</td>`).join('')}</tr>`).join('')}</tbody>
          </table></div>` : ''}
        </section>`;
      }).join('')}

      <div class="report-stamp-row" style="margin-top:18px">
        ${stampHTML({ no: 'زيارة ' + a.id, date: a.date, regionName: regionById(b.regionId).name, approved: a.approval === 'approved' })}
      </div>
      <h3 class="rep-h">التوقيعات</h3>
      <div class="signatures">
        ${sigCell('مدير الجودة', sg.quality || {}, (a.authorRole === 'quality_manager' ? a.authorName : '') || S().qualityManagerName, 'لم يُوقّع بعد')}
        ${sigCell('مدير التشغيل بالمنطقة ' + regionById(b.regionId).name, sg.ops || {}, (a.authorRole === 'ops_manager' ? a.authorName : '') || (opsUser || {}).name, 'لم يُوقّع بعد')}
        ${sigCell('مدير التشغيل بشركة سنام', {}, companyOpsName(), '—')}
        ${sigCell('المدير التنفيذي', {}, S().ceoName || (ceoUser || {}).name || '—', '—')}
      </div>
    </article>`;
  }

  function exportInvDoc(id) {
    const a = db.audits.find(x => x.id === id);
    if (!a) return;
    const b = branchById(a.branchId);
    const secs = (db.invSections && db.invSections.length ? db.invSections : INV_SECTIONS).slice().sort((x, y) => x.order - y.order);
    let body = '';
    secs.forEach((sec, i) => {
      const fields = (sec.items || []).filter(it => it.active !== false && a.data && a.data[it.id] != null && a.data[it.id] !== '');
      const rows = sec.rows ? ((a.rows || {})[sec.id] || []).filter(r => (r || []).some(v => v)) : [];
      if (!fields.length && !rows.length) return;
      body += `<h3>${i + 1}. ${esc(sec.name)}</h3>`;
      if (fields.length) body += `<table><tbody>${fields.map(it => `<tr><td style="width:38%;background:#f7f1e4">${esc(it.text)}</td><td>${esc(a.data[it.id])}</td></tr>`).join('')}</tbody></table>`;
      if (rows.length) body += `<table><thead><tr>${sec.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${sec.cols.map((c, ci) => `<td>${esc(r[ci] || '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    });
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${esc(a.id)}</title>
      <style>body{font-family:"Tajawal",Arial,sans-serif;padding:24px;color:#2b1a12}h1{font-size:19px;margin:0 0 6px}
      h2{font-size:13px;font-weight:400;color:#6b5b4b;margin:0 0 14px}h3{font-size:13.5px;margin:16px 0 6px;color:#6E1220}
      table{width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:8px}th,td{border:1px solid #c9b896;padding:5px 7px;text-align:right}
      th{background:#f4ecdd}.sig{display:flex;justify-content:space-between;margin-top:26px;font-size:11px;text-align:center}
      .sig div{flex:1;border-top:1px solid #c9b896;padding-top:5px;margin:0 6px}</style></head><body>
      <h1>${a.surprise ? 'تقرير زيارة جرد مفاجأة' : 'تقرير زيارة جرد'} — ${esc(a.id)}</h1>
      <h2>${esc(S().companyName)} · ${esc(regionById(b.regionId).name)} · ${esc(cityById(b.cityId).name)} · ${esc(b.name)} · ${fmtDate(a.date)}</h2>
      ${body}
      <div class="sig"><div>مدير الجودة<br>${esc(S().qualityManagerName)}</div><div>مدير التشغيل<br>${esc((db.users.find(u => u.role === 'ops_manager' && u.regionId === b.regionId) || {}).name || '')}</div><div>مدير التشغيل بشركة سنام<br>${esc(companyOpsName())}</div><div>المدير التنفيذي<br>${esc(S().ceoName || '')}</div></div>
      </body></html>`;
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob);
    link.download = a.id + '.doc'; document.body.appendChild(link); link.click(); link.remove();
    toast('تم تنزيل ملف Word');
  }

  function exportInv(fmt) {
    const f = ui.filters.inv;
    let list = db.audits.filter(a => a.kind === 'inv');
    if (scopeRegion()) list = list.filter(a => branchById(a.branchId).regionId === scopeRegion());
    if (f.branch !== 'all') list = list.filter(a => a.branchId === f.branch);
    if (f.q) list = list.filter(a => (branchById(a.branchId).name + a.id).includes(f.q.trim()));
    list.sort((a, b) => b.date.localeCompare(a.date));
    const rows = list.map((a, i) => {
      const b = branchById(a.branchId);
      return `<tr><td>${i + 1}</td><td>${esc(a.id)}</td><td>${esc(b.name)}</td><td>${esc(regionById(b.regionId).name)}</td><td>${fmtDate(a.date)}</td><td>${esc((a.data || {})['inv1-1'] || '')}</td><td>${esc((a.data || {})['inv1-5'] || '')}</td></tr>`;
    }).join('');
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>زيارات الجرد</title>
      <style>body{font-family:"Tajawal",Arial,sans-serif;padding:24px}h1{font-size:20px;margin:0 0 4px}
      h2{font-size:13px;font-weight:400;color:#6b5b4b;margin:0 0 16px}table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border:1px solid #c9b896;padding:6px 8px;text-align:right}th{background:#f4ecdd}</style></head><body>
      <h1>شركة سنام الرائدة — نظام الجودة</h1><h2>زيارات الجرد · ${list.length} زيارة</h2>
      <table><thead><tr><th>#</th><th>الرقم</th><th>الفرع</th><th>المنطقة</th><th>التاريخ</th><th>مسؤول الجرد</th><th>الوردية</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="7">لا توجد زيارات</td></tr>'}</tbody></table></body></html>`;
    if (fmt === 'word') {
      const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'زيارات-الجرد-' + TODAY_ISO() + '.doc'; document.body.appendChild(a); a.click(); a.remove();
      toast('تم تنزيل ملف Word'); return;
    }
    const w = window.open('', '_blank');
    if (!w) { toast('امنع حاجب النوافذ ثم أعد المحاولة', 'err'); return; }
    w.document.write(html); w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 500);
  }

  VIEWS.invvisits = function () {
    const f = ui.filters.inv;
    let list = db.audits.filter(a => a.kind === 'inv');
    if (scopeRegion()) list = list.filter(a => branchById(a.branchId).regionId === scopeRegion());
    if (f.branch !== 'all') list = list.filter(a => a.branchId === f.branch);
    if (f.from) list = list.filter(a => a.date >= f.from);
    if (f.to) list = list.filter(a => a.date <= f.to);
    if (f.q) list = list.filter(a => (branchById(a.branchId).name + a.id + (a.data && a.data['inv1-6'] || '')).includes(f.q.trim()));
    list.sort((a, b) => b.date.localeCompare(a.date));
    return `
    ${draftBanner()}
    <div class="toolbar no-print">
      <div class="spacer"></div>
      <div class="field" style="min-width:200px"><select class="select" data-filter="inv.branch">
        <option value="all">كل الفروع</option>
        ${scopeBranches().map(b => `<option value="${b.id}" ${f.branch === b.id ? 'selected' : ''}>${esc(branchLabel(b))}</option>`).join('')}
      </select></div>
      <div class="field" style="min-width:150px"><label class="tiny muted">من تاريخ</label><input class="input" type="date" value="${f.from || ''}" data-filter="inv.from"></div>
      <div class="field" style="min-width:150px"><label class="tiny muted">إلى تاريخ</label><input class="input" type="date" value="${f.to || ''}" data-filter="inv.to"></div>
      <div class="field" style="min-width:170px"><input class="input" placeholder="بحث…" value="${esc(f.q)}" data-search="inv.q"></div>
      ${canCreateInv() ? `<button class="btn btn-primary" data-action="new-inv-visit">${icon('plus', 16)} زيارة جرد جديدة</button>` : ''}
      <button class="btn btn-outline" data-action="inv-export" data-fmt="word">${icon('file', 16)} Word</button>
      <button class="btn btn-outline" data-action="inv-export" data-fmt="print">${icon('print', 16)} طباعة</button>
    </div>
    <section class="card">
      <div class="card-head"><div><h3 class="section-title">زيارات الجرد</h3>
        <p class="section-sub">${list.length} زيارة — جرد نهاية اليوم / الإغلاق</p></div></div>
      <div class="card-body" style="padding:0">
        ${list.length ? `<div class="tbl-wrap"><table class="tbl">
          <thead><tr><th>الرقم</th><th>الفرع</th><th>التاريخ</th><th>مسؤول الجرد</th><th>الوردية</th><th></th></tr></thead>
          <tbody>${list.map(a => { const b = branchById(a.branchId); return `<tr>
            <td class="num" dir="ltr">${esc(a.id)}</td>
            <td><b>${esc(b.name)}</b><div class="tiny muted">${esc(cityById(b.cityId).name)}</div></td>
            <td class="num">${fmtDate(a.date)}</td>
            <td>${esc((a.data || {})['inv1-1'] || '—')}</td>
            <td>${esc((a.data || {})['inv1-5'] || '—')}</td>
            <td><a class="btn btn-outline btn-sm" href="#/audit/${esc(a.id)}" data-nav="audit">فتح</a></td></tr>`; }).join('')}</tbody></table></div>`
          : emptyState('لا توجد زيارات جرد', 'ابدأ زيارة جرد جديدة')}
      </div>
    </section>`;
  };

  VIEWS['form-inv'] = function () {
    ui.editInv = true;
    const secs = (db.invSections && db.invSections.length ? db.invSections : INV_SECTIONS).slice().sort((a, b) => a.order - b.order);
    return `<div class="toolbar no-print">
      <div class="chip chip-gold">${secs.reduce((n, s) => n + (s.items || []).length, 0)} حقلًا</div>
      <div class="chip chip-muted">الدرجة القصوى ${secs.reduce((n, s) => n + (s.items || []).reduce((m, i) => m + (Number(i.max) || 0), 0), 0)}</div>
      <div class="spacer"></div>
      ${canEditForms() ? `<button class="btn btn-outline" data-action="add-section">${icon('plus', 16)} قسم جديد</button>` : ''}
      ${canEditForms() ? `<button class="btn btn-primary" data-action="save-forms">${icon('check', 16)} حفظ الاستمارة</button>` : ''}
      ${canCreateInv() ? `<button class="btn btn-gold" data-action="new-inv-visit">${icon('plus', 16)} زيارة جرد</button>` : ''}
    </div>
    ${secs.map((s, idx) => `<section class="card" style="margin-bottom:12px">
      <div class="card-head"><div class="kpi-icon" style="background:#F7F1E3;color:#8A7434;font-weight:600">${idx + 1}</div>
        <div><h3 class="section-title">${esc(s.name)}</h3><p class="section-sub">${(s.items || []).length} حقلًا${s.rows ? ' · جدول حر' : ''}</p></div>
        <div class="spacer"></div>
        ${isEditor() ? `<button class="btn btn-outline btn-sm" data-action="add-item" data-section="${s.id}">${icon('plus', 13)} حقل</button>` : ''}
        ${isEditor() ? `<button class="btn btn-outline btn-sm" data-action="delete-section" data-section="${s.id}">${icon('trash', 13)}</button>` : ''}
      </div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th style="width:44px">#</th><th>الحقل</th><th style="width:80px">الدرجة</th><th style="width:120px">الحالة</th><th style="width:96px"></th></tr></thead>
        <tbody>${(s.items || []).map((it, i) => `<tr class="${it.active === false ? 'row-off' : ''}">
          <td class="num muted">${i + 1}</td><td>${esc(it.text)}</td>
          <td class="num">${it.max || 4}</td>
          <td><button class="switch ${it.active === false ? '' : 'on'}" data-action="toggle-item" data-item="${it.id}"><i></i><span>${it.active === false ? 'متوقف' : 'مفعّل'}</span></button></td>
          <td class="row" style="justify-content:flex-end;gap:4px">
            <button class="icon-btn sm" data-action="edit-item" data-item="${it.id}">${icon('edit', 14)}</button>
            <button class="icon-btn sm" data-action="delete-item" data-item="${it.id}">${icon('trash', 14)}</button></td></tr>`).join('')}</tbody>
      </table></div></section>`).join('')}`;
  };

  VIEWS.analysis = function () {
    const f = ui.filters.analysis || { region: 'all', city: 'all', branch: 'all' };
    const scopedRegions = db.regions.filter(r => !scopeRegion() || r.id === scopeRegion());
    const regionId = f.region !== 'all' ? f.region : (scopeRegion() || 'all');
    const cityPool = f.region !== 'all' ? db.cities.filter(c => c.regionId === f.region) : db.cities.filter(c => !scopeRegion() || c.regionId === scopeRegion());
    const branchPool = db.branches.filter(b =>
      (!scopeRegion() || b.regionId === scopeRegion()) &&
      (f.region === 'all' || b.regionId === f.region) &&
      (f.city === 'all' || b.cityId === f.city));

    const list = db.audits.filter(a => {
      if (a.kind === 'inv' || a.overall == null) return false;
      const b = branchById(a.branchId);
      if (!b) return false;
      if (scopeRegion() && b.regionId !== scopeRegion()) return false;
      if (f.region !== 'all' && b.regionId !== f.region) return false;
      if (f.city !== 'all' && b.cityId !== f.city) return false;
      if (f.branch !== 'all' && a.branchId !== f.branch) return false;
      return true;
    }).sort((x, y) => y.date.localeCompare(x.date));

    const approved = list.filter(a => a.approval === 'approved');
    const basis = approved.length ? approved : list;
    const avg = avgScore(basis);
    const openF = db.findings.filter(x => list.some(a => a.id === x.auditId) && x.status !== 'مغلق');
    const apKey = [f.region, f.city, f.branch].join('|');
    const apAll = S().analysisApprovals || {};
    const approval = apAll[apKey] || null;
    const planFindings = db.findings.filter(x => list.some(a => a.id === x.auditId));
    const prevAuditIds = list.map(a => a.id);
    const prevF = db.findings.filter(x => prevAuditIds.includes(x.auditId));
    const prevDone = prevF.filter(x => x.status === 'مغلق');
    const prevPending = prevF.filter(x => x.status !== 'مغلق');
    const followKey = 'f|' + apKey;
    const followNote = (S().analysisFollowups || {})[followKey] || null;

    /* ترتيب الفروع */
    const rows = branchPool.map(b => {
      const arr = basis.filter(a => a.branchId === b.id);
      const sc = arr.length ? Math.round(arr.reduce((t, a) => t + a.overall, 0) / arr.length) : 0;
      return { b, sc, n: arr.length, open: openF.filter(x => x.branchId === b.id).length };
    }).filter(r => r.n > 0).sort((a, b) => b.sc - a.sc);

    /* نقاط القوة والضعف */
    const itemAgg = {};
    basis.forEach(a => db.sections.forEach(sec => scoredItems(sec).forEach(it => {
      const v = (a.items || {})[it.id]; if (v == null) return;
      const k = it.id; if (!itemAgg[k]) itemAgg[k] = { text: it.text, sum: 0, n: 0, sec: sec.name };
      itemAgg[k].sum += v; itemAgg[k].n++;
    })));
    const itemList = Object.values(itemAgg).map(x => ({ ...x, avg: x.sum / x.n }));
    const strengths = itemList.filter(x => x.avg >= 3.6).sort((a, b) => b.avg - a.avg).slice(0, 6);
    const weaknesses = itemList.filter(x => x.avg <= 2.4).sort((a, b) => a.avg - b.avg).slice(0, 8);

    /* المخالفات حسب الخطورة */
    const sev = { 'حرج': 0, 'عالي': 0, 'متوسط': 0 };
    openF.forEach(x => { if (sev[x.severity] != null) sev[x.severity]++; });
    const sevTotal = sev['حرج'] + sev['عالي'] + sev['متوسط'] || 1;

    /* مقارنة الفترات */
    const byMonth = {};
    basis.forEach(a => { const m = a.date.slice(0, 7); (byMonth[m] = byMonth[m] || []).push(a.overall); });
    const months = Object.keys(byMonth).sort();
    const monthVals = months.map(m => Math.round(byMonth[m].reduce((t, v) => t + v, 0) / byMonth[m].length));
    const cmp = months.length >= 2 ? (monthVals[monthVals.length - 1] - monthVals[0]) : 0;

    /* تكرار المخالفات */
    const rep = {};
    db.findings.filter(x => list.some(a => a.id === x.auditId)).forEach(x => { rep[x.title] = (rep[x.title] || 0) + 1; });
    const repeated = Object.entries(rep).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 6);

    /* الخطة التصحيحية */
    const plan = openF.slice().sort((a, b) => (a.severity === 'حرج' ? 0 : a.severity === 'عالي' ? 1 : 2) - (b.severity === 'حرج' ? 0 : b.severity === 'عالي' ? 1 : 2)).slice(0, 10);

    const recs = [];
    if (avg < 70) recs.push('الامتثال العام منخفض — يوصى بزيارة متابعة خلال أسبوعين وخطة تصحيح عاجلة.');
    else if (avg < 85) recs.push('الامتثال متوسط — التركيز على البنود الأقل من ٣ درجات وإعادة التحقق خلال شهر.');
    else recs.push('الامتثال جيد — الحفاظ على الأداء وتوثيق أفضل الممارسات كمرجع لباقي الفروع.');
    if (sev['حرج']) recs.push('يوجد ' + sev['حرج'] + ' مخالفة حرجة تتطلب معالجة فورية (خلال 72 ساعة).');
    if (repeated.length) recs.push('مخالفات متكررة: ' + repeated.slice(0, 3).map(([t]) => t).join('، ') + ' — تحتاج إجراءً جذريًا لا مؤقتًا.');
    if (weaknesses.length) recs.push('البنود الأضعف: ' + weaknesses.slice(0, 3).map(w => w.text).join(' / '));
    if (cmp < 0) recs.push('الأداء انخفض ' + Math.abs(cmp) + ' نقطة مقارنة بأول فترة — يوصى بمراجعة أسباب التراجع.');
    else if (cmp > 0) recs.push('تحسّن بمقدار ' + cmp + ' نقطة بين الفترات — استمرار نفس الإجراءات.');

    const mailBody = encodeURIComponent('تحليل تقارير الجودة\n' + 'الامتثال: ' + avg + '%\n' + recs.join('\n'));
    const kpi = (label, val, sub) => `<div class="kpi"><div class="kpi-top"><span class="kpi-label">${label}</span></div><div class="kpi-value num">${val}</div><div class="kpi-foot"><span>${sub}</span></div></div>`;

    const regionLbl = f.region === 'all' ? 'كل المناطق' : regionById(f.region).name;
    const cityLbl = f.city === 'all' ? 'كل المدن' : cityById(f.city).name;
    const branchLbl = f.branch === 'all' ? 'كل الفروع' : branchById(f.branch).name;
    const pct = v => Math.max(0, Math.min(100, Math.round(v)));
    const printBlock = `
    <div class="analysis-print">
      <div class="ap-head">
        <img src="${esc(S().logo)}" class="ap-logo" alt="">
        <div class="ap-brand">${esc(S().companyName)} — ${esc(S().serviceName)}</div>
        <h1>تقرير تحليل أداء الجودة</h1>
        <table class="ap-meta-tbl"><tbody>
          <tr><td>المنطقة</td><td>${esc(regionLbl)}</td><td>المدينة</td><td>${esc(cityLbl)}</td></tr>
          <tr><td>الفرع</td><td>${esc(branchLbl)}</td><td>مدير الفرع</td><td>${esc(f.branch !== 'all' ? (branchById(f.branch).manager || '—') : '—')}</td></tr>
          <tr><td>عدد التقارير</td><td>${basis.length} (${approved.length} معتمد)</td><td>تاريخ الإصدار</td><td>${esc(fmtDate(TODAY_ISO()))}</td></tr>
        </tbody></table>
      </div>
      <table class="ap-kpis"><tr>
        <td><span>الامتثال العام</span><b>${avg}%</b></td>
        <td><span>الزيارات</span><b>${basis.length}</b></td>
        <td><span>ملاحظات مفتوحة</span><b>${openF.length}</b></td>
        <td><span>الفروع</span><b>${rows.length}</b></td>
      </tr></table>

      <div class="ap-sec-title">ترتيب الفروع من الأفضل إلى الأقل</div>
      <table class="ap-bars">${rows.length ? rows.map(r => `<tr><td class="lbl">${esc(r.b.name)}</td><td class="bar"><i style="width:${pct(r.sc)}%"></i></td><td class="val">${r.sc}%</td></tr>`).join('') : '<tr><td>لا بيانات</td></tr>'}</table>

      <div class="ap-cols">
        <div>
          <div class="ap-sec-title">نقاط القوة</div>
          <ul>${strengths.length ? strengths.map(x => `<li>${esc(x.text)} — <b>${x.avg.toFixed(1)}</b></li>`).join('') : '<li>لا توجد</li>'}</ul>
        </div>
        <div>
          <div class="ap-sec-title">نقاط الضعف</div>
          <ul>${weaknesses.length ? weaknesses.map(x => `<li>${esc(x.text)} — <b>${x.avg.toFixed(1)}</b></li>`).join('') : '<li>لا توجد</li>'}</ul>
        </div>
      </div>

      <div class="ap-cols">
        <div>
          <div class="ap-sec-title">المخالفات حسب الخطورة</div>
          <table class="ap-bars">${[['حرج', sev['حرج'], '#B03A2E'], ['عالي', sev['عالي'], '#C08A2E'], ['متوسط', sev['متوسط'], '#8A7434']].map(([n, v, c]) => `<tr><td class="lbl">${n}</td><td class="bar"><i style="width:${pct(v / sevTotal * 100)}%;background:${c}"></i></td><td class="val">${v}</td></tr>`).join('')}</table>
        </div>
        <div>
          <div class="ap-sec-title">الأداء بين الفترات</div>
          <table class="ap-simple">${months.length ? months.map((m, i) => `<tr><td>${esc(m)}</td><td class="val">${monthVals[i]}%</td></tr>`).join('') : '<tr><td>لا بيانات</td></tr>'}</table>
          <div class="ap-note">الفرق: ${cmp >= 0 ? '+' : ''}${cmp} نقطة</div>
        </div>
      </div>

      <div class="ap-sec-title">أسباب تكرار المخالفات</div>
      <table class="ap-simple">${repeated.length ? repeated.map(([t, n]) => `<tr><td>${esc(t)}</td><td class="val">${n} مرات</td></tr>`).join('') : '<tr><td>لا تكرار ملحوظ</td></tr>'}</table>

      <div class="ap-sec-title">الخطة العلاجية — المدة والتنفيذ</div>
      <table class="ap-plan"><thead><tr><th>الملاحظة</th><th>الخطورة</th><th>المسؤول</th><th>المدة</th><th>الموعد</th><th>تمت؟</th></tr></thead>
      <tbody>${planFindings.length ? planFindings.slice(0, 12).map(x => {
        const days = (x.createdAt && x.due) ? Math.max(0, Math.round((new Date(x.due) - new Date(x.createdAt)) / 86400000)) : null;
        return `<tr><td>${esc(x.title)}</td><td>${esc(x.severity)}</td><td>${esc(x.owner || 'مدير الفرع')}</td><td class="val">${days == null ? '—' : days + ' يوم'}</td><td class="val">${x.due ? esc(fmtDate(x.due)) : '—'}</td><td class="val">${x.status === 'مغلق' ? 'تمت' : (x.status || 'لم تتم')}</td></tr>`;
      }).join('') : '<tr><td colspan="6">لا ملاحظات</td></tr>'}</tbody></table>

      <div class="ap-sec-title">متابعة الملاحظات السابقة</div>
      <table class="ap-simple"><tr><td>تمت معالجتها</td><td class="val">${prevDone.length} من ${prevF.length}</td></tr>
      <tr><td>لم تتم</td><td class="val">${prevPending.length}</td></tr></table>
      ${prevPending.length ? `<div class="ap-note">سبب عدم المتابعة: ${esc(followNote ? followNote.text : 'لم يُكتب — يحتاج توضيحًا من مدير الجودة')}</div>` : ''}

      <div class="ap-sec-title">توصيات للإدارة العليا</div>
      <ul>${recs.map(r => `<li>${esc(r)}</li>`).join('')}</ul>

      <div class="ap-signs">
        <div><span>مدير الجودة بالمنطقة</span><b>${esc((approval && approval.by) || S().qualityManagerName)}</b><em>${approval ? fmtDate(approval.at) : 'لم يُعتمد بعد'}</em></div>
        <div><span>مدير التشغيل بالمنطقة</span><b>${esc((db.users.find(u => u.role === 'ops_manager' && u.regionId === (f.region === 'all' ? scopeRegion() : f.region)) || {}).name || '—')}</b><em>${approval ? 'اعتماد التحليل' : '—'}</em></div>
        <div><span>مدير التشغيل بشركة سنام</span><b>${esc(companyOpsName())}</b><em>—</em></div>
        <div><span>المدير التنفيذي</span><b>${esc((db.users.find(u => u.role === 'ceo') || {}).name || '—')}</b><em>—</em></div>
      </div>
    </div>`;

    return printBlock + `
    <div class="analysis-page">
    <div class="analysis-print-head">
      <div class="aph-brand">${esc(S().companyName)} — ${esc(S().serviceName)}</div>
      <h1>لوحة تحليل أداء الجودة</h1>
      <div class="aph-meta">${esc(regionLbl)} · ${esc(cityLbl)} · ${esc(branchLbl)} · ${esc(String(S().year))}</div>
    </div>
    <div class="toolbar no-print">
      <div class="field" style="min-width:150px"><select class="select" data-filter="analysis.region">
        <option value="all" ${f.region === 'all' ? 'selected' : ''}>كل المناطق</option>
        ${scopedRegions.map(r => `<option value="${r.id}" ${f.region === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
      </select></div>
      <div class="field" style="min-width:150px"><select class="select" data-filter="analysis.city">
        <option value="all" ${f.city === 'all' ? 'selected' : ''}>كل المدن</option>
        ${cityPool.map(c => `<option value="${c.id}" ${f.city === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
      </select></div>
      <div class="field" style="min-width:180px"><select class="select" data-filter="analysis.branch">
        <option value="all" ${f.branch === 'all' ? 'selected' : ''}>كل الفروع</option>
        ${branchPool.map(b => `<option value="${b.id}" ${f.branch === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
      </select></div>
      <div class="spacer"></div>
      <span class="chip ${approved.length ? 'chip-ok' : 'chip-warn'}">${approved.length ? 'تحليل جاهز — ' + approved.length + ' تقرير معتمد' : 'لا تقارير معتمدة بعد — العرض مبدئي'}</span>
      ${approval ? `<span class="chip chip-gold">معتمد — ${esc(approval.by)} · ${esc(fmtDate(approval.at))}</span>` : (isQM() ? `<button class="btn btn-gold" data-action="approve-analysis" data-key="${esc(apKey)}">${icon('check', 15)} اعتماد التحليل</button>` : '')}
      <a class="btn btn-outline" href="mailto:?subject=${encodeURIComponent('تحليل تقارير الجودة')}&body=${mailBody}">${icon('upload', 15)} إرسال التحليل</a>
      <button class="btn btn-primary" data-action="print">${icon('print', 16)} طباعة / PDF</button>
    </div>

    <div class="kpis" style="margin-bottom:16px">
      ${kpi('الامتثال العام', avg + '%', basis.length + ' تقرير في التحليل')}
      ${kpi('الزيارات', basis.length, 'معتمدة: ' + approved.length)}
      ${kpi('ملاحظات مفتوحة', openF.length, 'تحتاج إجراء')}
      ${kpi('الفروع المشمولة', rows.length, rows.length ? 'الأفضل: ' + rows[0].b.name : '—')}
    </div>

    <div class="grid-2" style="display:grid;grid-template-columns:1.1fr .9fr;gap:16px;margin-bottom:16px">
      <section class="card"><div class="card-head"><div><h3 class="section-title">ترتيب الفروع من الأفضل إلى الأقل</h3><p class="section-sub">حسب متوسط درجة التقارير المعتمدة</p></div></div>
        <div class="card-body">${rows.length ? barList(rows.map(r => ({ label: r.b.name, value: r.sc }))) : '<p class="small muted">لا بيانات كافية.</p>'}</div></section>

      <section class="card"><div class="card-head"><div><h3 class="section-title">تصنيف المخالفات حسب الخطورة</h3><p class="section-sub">${openF.length} ملاحظة مفتوحة</p></div></div>
        <div class="card-body" style="text-align:center">${donut([{ label: 'حرج', value: sev['حرج'] }, { label: 'عالي', value: sev['عالي'] }, { label: 'متوسط', value: sev['متوسط'] }], 170)}
          <div class="row" style="justify-content:center;gap:14px;margin-top:8px">
            <span class="chip chip-bad">حرج ${sev['حرج']}</span><span class="chip chip-warn">عالي ${sev['عالي']}</span><span class="chip chip-gold">متوسط ${sev['متوسط']}</span>
          </div></div></section>
    </div>

    <section class="card" style="margin-bottom:16px">
      <div class="card-head"><div><h3 class="section-title">مقارنة الأداء بين الفترات</h3><p class="section-sub">${months.length ? 'من ' + months[0] + ' إلى ' + months[months.length - 1] + ' · الفرق ' + (cmp >= 0 ? '+' : '') + cmp + ' نقطة' : 'لا بيانات'}</p></div></div>
      <div class="card-body">${months.length ? lineChart(months.map(m => m.slice(5)), monthVals, { label: 'الامتثال', min: 0 }) : '<p class="small muted">زيارة واحدة لا تكفي للمقارنة.</p>'}</div>
    </section>

    <div class="grid-2" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <section class="card"><div class="card-head"><div><h3 class="section-title">نقاط القوة</h3></div></div>
        <div class="card-body">${strengths.length ? `<ul class="point-list good">${strengths.map(x => `<li><span>${esc(x.text)}</span><b>${x.avg.toFixed(1)}</b></li>`).join('')}</ul>` : '<p class="small muted">لا توجد بنود بتقييم مرتفع.</p>'}</div></section>
      <section class="card"><div class="card-head"><div><h3 class="section-title">نقاط الضعف</h3></div></div>
        <div class="card-body">${weaknesses.length ? `<ul class="point-list bad">${weaknesses.map(x => `<li><span>${esc(x.text)}</span><b>${x.avg.toFixed(1)}</b></li>`).join('')}</ul>` : '<p class="small muted">لا نقاط ضعف مسجلة.</p>'}</div></section>
    </div>

    <section class="card" style="margin-bottom:16px">
      <div class="card-head"><div><h3 class="section-title">تحليل أسباب تكرار المخالفات</h3><p class="section-sub">أكثر البنود تكرارًا في التقارير</p></div></div>
      <div class="card-body">${repeated.length ? `<div class="table-wrap"><table class="tbl compact"><thead><tr><th>البند</th><th style="width:90px">مرات التكرار</th><th>القراءة</th></tr></thead><tbody>
        ${repeated.map(([t, n]) => `<tr><td>${esc(t)}</td><td class="num"><b>${n}</b></td><td class="small muted">${n >= 3 ? 'خلل نظامي متكرر — يحتاج إجراءً جذريًا وتدريبًا' : 'يستحق متابعة في الزيارة القادمة'}</td></tr>`).join('')}
      </tbody></table></div>` : '<p class="small muted">لا تكرار ملحوظ.</p>'}</div>
    </section>

    <section class="card" style="margin-bottom:16px">
      <div class="card-head"><div><h3 class="section-title">خطة تصحيحية — مسؤول وموعد تنفيذ</h3></div></div>
      <div class="card-body">${plan.length ? `<div class="table-wrap"><table class="tbl compact"><thead><tr><th>الملاحظة</th><th style="width:90px">الخطورة</th><th style="width:150px">المسؤول</th><th style="width:120px">الموعد</th></tr></thead><tbody>
        ${plan.map(x => `<tr><td>${esc(x.title)}</td><td><span class="chip ${x.severity === 'حرج' ? 'chip-bad' : x.severity === 'عالي' ? 'chip-warn' : 'chip-gold'}">${x.severity}</span></td><td>${esc(x.owner || 'مدير الفرع')}</td><td class="num">${x.due ? fmtDate(x.due) : '—'}</td></tr>`).join('')}
      </tbody></table></div>` : '<p class="small muted">لا ملاحظات مفتوحة.</p>'}</div>
    </section>

    <section class="card" style="margin-bottom:16px">
      <div class="card-head"><div><h3 class="section-title">متابعة الملاحظات السابقة</h3>
        <p class="section-sub">${prevDone.length} من ${prevF.length} تمت معالجتها · ${prevPending.length} لم تتم</p></div></div>
      <div class="card-body">
        ${prevPending.length ? `<div class="table-wrap"><table class="tbl compact"><thead><tr><th>الملاحظة</th><th>الخطورة</th><th>الموعد</th><th>الحالة</th></tr></thead>
          <tbody>${prevPending.slice(0, 10).map(x => `<tr><td>${esc(x.title)}</td><td>${esc(x.severity)}</td><td class="num">${x.due ? fmtDate(x.due) : '—'}</td><td><span class="chip chip-warn">${esc(x.status || 'مفتوح')}</span></td></tr>`).join('')}</tbody></table></div>`
          : `<div class="note" style="border-color:#BFD9C3;background:#F1F8F2">${icon('check', 16)}<span>كل ملاحظات التقارير السابقة تمت معالجتها ✅</span></div>`}
        ${prevPending.length ? `<div class="field" style="margin-top:14px">
          <label>سبب عدم متابعة/معالجة الملاحظات السابقة</label>
          <textarea class="textarea" id="followNote" placeholder="اكتب السبب بوضوح (نقص توريد، تغيير مدير الفرع، إجراء قيد التنفيذ…)">${esc(followNote ? followNote.text : '')}</textarea>
        </div>
        <div class="row" style="justify-content:flex-end;margin-top:8px">
          ${followNote ? `<span class="chip chip-muted">آخر تحديث: ${esc(followNote.by)} · ${esc(fmtDate(followNote.at))}</span>` : ''}
          <button class="btn btn-primary btn-sm" data-action="save-followup" data-key="${esc(followKey)}">${icon('check', 14)} حفظ السبب</button>
        </div>` : ''}
      </div>
    </section>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">توصيات للإدارة العليا</h3></div></div>
      <div class="card-body"><ul class="point-list">${recs.map(r => `<li><span>${esc(r)}</span></li>`).join('')}</ul>
        <p class="tiny muted" style="margin-top:8px">التحليل مبني على ${basis.length} تقرير${approved.length ? ' معتمد' : ''} — يُحدَّث تلقائيًا مع كل اعتماد جديد.</p></div>
    </section>
    </div>`;
  };


  /* ---------------- KPI مدير المنطقة ---------------- */
  VIEWS.kpi = function () {
    if (!isManager() && !isCeo() && !isAdmin()) return emptyState('غير مصرح', 'هذه الصفحة للإدارة');
    const regId = scopeRegion() || ui.filters.kpiRegion || (db.regions[0] && db.regions[0].id);
    const reg = regionById(regId);
    const bs = db.branches.filter(b => b.regionId === regId);
    const audits = db.audits.filter(a => bs.some(b => b.id === a.branchId));
    const avg = audits.length ? Math.round(audits.reduce((t, a) => t + a.overall, 0) / audits.length) : 0;

    const fs = db.findings.filter(f => bs.some(b => b.id === f.branchId));
    const closed = fs.filter(f => f.status === 'مغلق').length;
    const open = fs.length - closed;
    const today = TODAY_ISO();
    const overdue = fs.filter(f => f.status !== 'مغلق' && f.due && f.due < today).length;
    const closureRate = fs.length ? Math.round(closed / fs.length * 100) : 100;
    const overdueShare = open ? Math.round(overdue / open * 100) : 0;

    /* التغطية: عدد الزيارات مقابل المستهدف السنوي */
    let expected = 0;
    bs.forEach(b => COVERAGE_ORDER.forEach(t => { expected += coverageFor(b.id, t, S().year).expected || 0; }));
    const coverage = expected ? Math.min(100, Math.round(audits.length / expected * 100)) : 0;

    /* التحسن بين أول وآخر شهر */
    const byMonth = {};
    audits.forEach(a => { const m = a.date.slice(0, 7); (byMonth[m] = byMonth[m] || []).push(a.overall); });
    const ms = Object.keys(byMonth).sort();
    const trend = ms.length >= 2
      ? Math.round((byMonth[ms[ms.length - 1]].reduce((t, v) => t + v, 0) / byMonth[ms[ms.length - 1]].length) - (byMonth[ms[0]].reduce((t, v) => t + v, 0) / byMonth[ms[0]].length))
      : 0;
    const trendScore = Math.max(0, Math.min(100, 50 + trend * 2));

    const parts = [
      { k: 'الزيارات (المعدل العام)', w: 40, v: avg },
      { k: 'إغلاق الملاحظات', w: 20, v: closureRate },
      { k: 'تغطية خطة الزيارات', w: 15, v: coverage },
      { k: 'التحسن بين الفترات', w: 15, v: trendScore },
      { k: 'الالتزام بمواعيد المعالجة', w: 10, v: 100 - overdueShare }
    ];
    const score = Math.round(parts.reduce((t, p) => t + p.v * p.w / 100, 0));
    const band = score >= 90 ? { t: 'متميز', c: 'chip-ok', d: 'أداء استثنائي — يستحق التكريم ونقل الممارسات لباقي المناطق' }
      : score >= 75 ? { t: 'جيد جدًا', c: 'chip-ok', d: 'أداء قوي مع فرص تحسين محدودة' }
        : score >= 60 ? { t: 'جيد', c: 'chip-warn', d: 'أداء مقبول يحتاج متابعة أدق للملاحظات المفتوحة' }
          : { t: 'غير مقبول', c: 'chip-bad', d: 'يتطلب خطة تصحيح عاجلة ومتابعة أسبوعية' };

    const branchRows = bs.map(b => {
      const arr = audits.filter(a => a.branchId === b.id);
      const sc = arr.length ? Math.round(arr.reduce((t, a) => t + a.overall, 0) / arr.length) : 0;
      const op = fs.filter(f => f.branchId === b.id && f.status !== 'مغلق').length;
      return { b, sc, n: arr.length, op };
    }).sort((x, y) => y.sc - x.sc);

    return `
    <div class="toolbar no-print">
      ${isAdmin() ? `<div class="field" style="min-width:160px"><select class="select" data-filter="kpiRegion">
        ${db.regions.map(r => `<option value="${r.id}" ${r.id === regId ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
      </select></div>` : ''}
      <div class="spacer"></div>
      <span class="chip chip-muted">${audits.length} زيارة · ${fs.length} ملاحظة</span>
      <button class="btn btn-primary" data-action="print">${icon('print', 16)} طباعة</button>
    </div>

    <section class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <div style="position:relative;width:150px;height:150px;flex:0 0 150px">
          ${ring(score, 150)}
          <div style="position:absolute;inset:0;display:grid;place-items:center;font-size:34px;font-weight:700">${score}</div>
        </div>
        <div style="flex:1;min-width:240px">
          <div class="tiny muted">تقييم مدير منطقة ${esc(reg.name)}</div>
          <h2 style="font-family:'Amiri',serif;font-size:28px;margin:4px 0 8px">${esc((db.users.find(u => u.role === 'regional_manager' && u.regionId === regId) || {}).name || 'مدير المنطقة')}</h2>
          <span class="chip ${band.c}" style="font-size:13px">${band.t}</span>
          <p class="small muted" style="margin-top:8px">${band.d}</p>
        </div>
      </div>
    </section>

    <div class="grid-2" style="display:grid;grid-template-columns:1.1fr .9fr;gap:16px;margin-bottom:16px">
      <section class="card"><div class="card-head"><div><h3 class="section-title">مكوّنات الدرجة</h3><p class="section-sub">مجموعها 100</p></div></div>
        <div class="card-body">
          ${parts.map(p => `<div style="margin-bottom:12px">
            <div class="row" style="justify-content:space-between;font-size:12.5px"><span>${p.k} <span class="tiny muted">(${p.w}%)</span></span><b class="num">${Math.round(p.v)}</b></div>
            <div class="bar-track" style="margin-top:6px"><i style="width:${Math.max(0, Math.min(100, p.v))}%;background:${p.v >= 85 ? 'var(--ok)' : p.v >= 70 ? 'var(--warn)' : 'var(--bad)'}"></i></div>
          </div>`).join('')}
        </div></section>

      <section class="card"><div class="card-head"><div><h3 class="section-title">ملخص المتابعة</h3></div></div>
        <div class="card-body">
          <div class="stat-line"><span>المعدل العام للزيارات</span><b class="num">${avg}%</b></div>
          <div class="stat-line"><span>ملاحظات مغلقة</span><b class="num">${closed} / ${fs.length}</b></div>
          <div class="stat-line"><span>ملاحظات مفتوحة</span><b class="num">${open}</b></div>
          <div class="stat-line"><span>متأخرة عن الموعد</span><b class="num" style="color:var(--bad)">${overdue}</b></div>
          <div class="stat-line"><span>تغطية الخطة</span><b class="num">${coverage}%</b></div>
          <div class="stat-line"><span>التحسن بين الفترات</span><b class="num">${trend >= 0 ? '+' : ''}${trend} نقطة</b></div>
        </div></section>
    </div>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">درجات الفروع</h3><p class="section-sub">من الأفضل إلى الأقل</p></div></div>
      <div class="card-body"><div class="table-wrap"><table class="tbl compact">
        <thead><tr><th>#</th><th>الفرع</th><th style="width:100px">الدرجة</th><th style="width:120px">ملاحظات مفتوحة</th><th style="width:120px">الحالة</th></tr></thead>
        <tbody>${branchRows.map((r, i) => `<tr>
          <td class="num muted">${i + 1}</td><td>${esc(r.b.name)}</td>
          <td class="num"><b>${r.sc}%</b></td><td class="num">${r.op}</td>
          <td><span class="chip ${r.sc >= 85 ? 'chip-ok' : r.sc >= 70 ? 'chip-warn' : 'chip-bad'}">${r.sc >= 85 ? 'متميز' : r.sc >= 70 ? 'جيد' : 'يحتاج متابعة'}</span></td>
        </tr>`).join('')}</tbody></table></div></div>
    </section>`;
  };


  /* ---------------- ملفي ---------------- */
  VIEWS.myfile = function () {
    const u = currentUser();
    if (!u) return emptyState('سجّل الدخول', 'ملفك الشخصي يظهر بعد تسجيل الدخول');
    const mine = db.audits.filter(a => a.createdBy === u.username || (u.name && a.auditor && a.auditor.indexOf(u.name.split(' ')[0]) === 0) || (a.auditor === u.name));
    mine.sort((a, b) => b.date.localeCompare(a.date));
    const approved = mine.filter(a => a.approval === 'approved');
    const avg = mine.length ? Math.round(mine.reduce((t, a) => t + a.overall, 0) / mine.length) : 0;
    const fs = db.findings.filter(f => mine.some(a => a.id === f.auditId));
    const closed = fs.filter(f => f.status === 'مغلق').length;
    const open = fs.length - closed;
    const overdue = fs.filter(f => f.status !== 'مغلق' && f.due && f.due < TODAY_ISO()).length;
    const closure = fs.length ? Math.round(closed / fs.length * 100) : 100;
    const timeliness = open ? Math.round((open - overdue) / open * 100) : 100;
    const volume = Math.min(100, Math.round(mine.length / 12 * 100));
    const score = Math.round(avg * .5 + closure * .25 + timeliness * .15 + volume * .1);
    const band = score >= 90 ? { t: 'متميز', c: 'chip-ok' } : score >= 75 ? { t: 'جيد جدًا', c: 'chip-ok' } : score >= 60 ? { t: 'جيد', c: 'chip-warn' } : { t: 'غير مقبول', c: 'chip-bad' };
    const rank = db.audits.filter(a => a.createdBy).length ? Math.min(100, avg) : avg;

    return `
    <div class="toolbar no-print">
      <span class="chip chip-gold">${roleLabel(u.role)}${u.regionId && u.regionId !== 'all' ? ' — ' + esc(regionById(u.regionId).name) : ''}</span>
      <div class="spacer"></div>
      <button class="btn btn-outline" data-action="my-signature">${icon('edit', 15)} توقيعي الإلكتروني</button>
      <button class="btn btn-primary" data-action="print">${icon('print', 16)} طباعة</button>
    </div>

        <section class="card" style="margin-bottom:16px">
      <div class="card-head"><div><h3 class="section-title">بيانات الهوية</h3>
        <p class="section-sub">تظهر في ملفك الشخصي — تقدر تعدّلها بنفسك</p></div></div>
      <div class="card-body">
        <div class="form-grid">
          <div class="field"><label>رقم الهوية / الإقامة</label><input class="input num" dir="ltr" id="pfId" value="${esc(u.nationalId || '')}" placeholder="10 أرقام"></div>
          <div class="field"><label>الجنسية</label><input class="input" id="pfNat" value="${esc(u.nationality || '')}" placeholder="سعودي / يمني / ..."></div>
          <div class="field"><label>تاريخ الإصدار</label><input class="input" type="date" id="pfIssue" value="${esc(u.idIssue || '')}"></div>
          <div class="field"><label>تاريخ الانتهاء</label><input class="input" type="date" id="pfExpiry" value="${esc(u.idExpiry || '')}"></div>
        </div>
        <div class="row" style="justify-content:flex-end;margin-top:10px">
          <button class="btn btn-primary btn-sm" data-action="save-my-profile">${icon('check', 15)} حفظ البيانات</button>
        </div>
      </div>
    </section>

<section class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <div style="position:relative;width:130px;height:130px;flex:0 0 130px">${ring(score, 130)}<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:30px;font-weight:700">${score}</div></div>
        <div style="flex:1;min-width:220px">
          <div class="tiny muted">التقييم الشخصي من 100</div>
          <h2 style="font-family:'Amiri',serif;font-size:26px;margin:2px 0 6px">${esc(u.name || u.username)}</h2>
          <span class="chip ${band.c}">${band.t}</span>
          <p class="small muted" style="margin-top:8px">${mine.length} زيارة · ${approved.length} معتمدة · متوسط الدرجات ${avg}%</p>
        </div>
        <div style="min-width:220px;flex:1">
          <div class="stat-line"><span>متوسط درجات زياراتي</span><b>${avg}%</b></div>
          <div class="stat-line"><span>ملاحظات مغلقة</span><b>${closed} / ${fs.length}</b></div>
          <div class="stat-line"><span>ملاحظات متأخرة</span><b style="color:var(--bad)">${overdue}</b></div>
          <div class="stat-line"><span>زياراتي هذا العام</span><b>${mine.filter(a => a.date.startsWith(String(S().year))).length}</b></div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">زياراتي</h3><p class="section-sub">آخر ${Math.min(mine.length, 12)} زيارة</p></div></div>
      <div class="card-body"><div class="table-wrap"><table class="tbl compact">
        <thead><tr><th>الزيارة</th><th>الفرع</th><th>التاريخ</th><th>الدرجة</th><th>الحالة</th></tr></thead>
        <tbody>${mine.slice(0, 12).map(a => `<tr>
          <td class="num">${esc(a.id)}</td><td>${esc(branchById(a.branchId).name)}</td>
          <td class="num">${fmtDate(a.date)}</td><td class="num"><b>${a.overall}%</b></td>
          <td><span class="chip ${a.approval === 'approved' ? 'chip-ok' : 'chip-warn'}">${a.approval === 'approved' ? 'معتمد' : 'بانتظار الاعتماد'}</span></td>
        </tr>`).join('') || '<tr><td colspan="5" class="muted">لا زيارات بعد.</td></tr>'}</tbody>
      </table></div></div>
    </section>`;
  };

  VIEWS.reports = function () {
    const f = ui.filters.report;
    const yrs = [...new Set(db.audits.map(a => new Date(a.date).getFullYear()).filter(y => !isNaN(y)))];
    if (!yrs.includes(Number(f.year) || S().year)) yrs.push(Number(f.year) || S().year);
    yrs.sort((a, b) => b - a);
    const cities = db.cities.filter(c => !f.region || c.regionId === f.region);
    const branches = db.branches.filter(b => (!f.region || b.regionId === f.region) && (!f.city || b.cityId === f.city));
    const rng = reportRange();
    const b = f.branch ? branchById(f.branch) : null;
    const list = b ? db.audits.filter(a => a.branchId === b.id && a.date >= rng.from && a.date <= rng.to).sort((x, y) => x.date.localeCompare(y.date)) : [];
    const modeName = { weekly: 'أسبوعي', monthly: 'شهري', annual: 'سنوي' }[rng.mode] || 'شهري';

    return `
    <div class="toolbar no-print" style="align-items:flex-end;flex-wrap:wrap;gap:10px">
      <div class="field" style="min-width:150px"><label>نوع التقرير</label>
        <select class="select" data-filter="report.mode">
          <option value="weekly" ${rng.mode === 'weekly' ? 'selected' : ''}>أسبوعي</option>
          <option value="monthly" ${rng.mode === 'monthly' ? 'selected' : ''}>شهري</option>
          <option value="annual" ${rng.mode === 'annual' ? 'selected' : ''}>سنوي</option>
        </select></div>

      ${rng.mode === 'weekly' ? `
        <div class="field" style="min-width:150px"><label>من تاريخ</label>
          <input class="input num" type="date" data-filter="report.from" value="${rng.from}"></div>
        <div class="field" style="min-width:150px"><label>إلى تاريخ</label>
          <input class="input num" type="date" data-filter="report.to" value="${rng.to}"></div>` : ''}

      ${rng.mode === 'monthly' ? `
        <div class="field" style="min-width:130px"><label>الشهر</label>
          <select class="select" data-filter="report.month">
            ${MONTHS.map((m, i) => `<option value="${i}" ${Number(f.month) === i ? 'selected' : ''}>${m}</option>`).join('')}
          </select></div>` : ''}

      ${rng.mode !== 'weekly' ? `
        <div class="field" style="min-width:110px"><label>السنة</label>
          <select class="select" data-filter="report.year">
            ${yrs.map(y => `<option value="${y}" ${Number(f.year) === Number(y) ? 'selected' : ''}>${y}</option>`).join('')}
          </select></div>` : ''}

      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="open-report">${icon('file', 16)} عرض التقرير</button>
    </div>

    <div class="toolbar no-print" style="align-items:flex-end;flex-wrap:wrap;gap:10px">
      <div class="field" style="min-width:150px"><label>المنطقة</label>
        <select class="select" data-filter="report.region">
          <option value="">— اختر المنطقة —</option>
          ${db.regions.map(r => `<option value="${r.id}" ${f.region === r.id ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:150px"><label>المدينة</label>
        <select class="select" data-filter="report.city" ${!f.region ? 'disabled' : ''}>
          <option value="">— اختر المدينة —</option>
          ${cities.map(c => `<option value="${c.id}" ${f.city === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
        </select></div>
      <div class="field" style="min-width:180px"><label>الفرع</label>
        <select class="select" data-filter="report.branch" ${!f.city ? 'disabled' : ''}>
          <option value="">— اختر الفرع —</option>
          ${branches.map(x => `<option value="${x.id}" ${f.branch === x.id ? 'selected' : ''}>${esc(x.name)} (${x.code})</option>`).join('')}
        </select></div>
    </div>

    <section class="card">
      <div class="card-head"><div><h3 class="section-title">ملخص الفترة</h3>
        <p class="section-sub">${modeName} · ${esc(fmtDate(rng.from))} — ${esc(fmtDate(rng.to))}${b ? ' · ' + esc(b.name) : ''}</p></div>
        <div class="spacer"></div>
        <span class="chip chip-gold">${list.length} زيارة</span></div>
      <div class="kpis" style="padding:0 16px 16px">
        ${kpi('الزيارات في الفترة', list.length, '', 'calendar', b ? b.code : '—', '', '')}
        ${kpi('متوسط الامتثال', list.length ? avgScore(list) : 0, '%', 'target', list.length ? `${pointsOf(avgScore(list))} من ${TOTAL_POINTS}` : 'لا زيارات', '', '')}
        ${kpi('ملاحظات مفتوحة', b ? findingsOf(b.id).filter(x => x.status !== 'مغلق').length : 0, '', 'alert', b ? 'الفرع المحدد' : '—', '', '')}
        ${kpi('نسبة الاجتياز', list.length ? Math.round(list.filter(x => x.overall >= S().passScore).length / list.length * 100) : 0, '%', 'shield', 'خلال الفترة', '', '')}
      </div>
    </section>

    ${b ? `<section class="card">
      <div class="card-head"><div><h3 class="section-title">زيارات الفترة</h3><p class="section-sub">${esc(b.name)} — ${esc(cityById(b.cityId).name)}</p></div></div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>الزيارة</th><th>النوع</th><th>التاريخ</th><th>المدقق</th><th>الدرجة</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${list.length ? list.map(a => `<tr>
          <td class="num strong">${a.id}</td><td>${typeLabel(a)}</td><td class="num">${fmtDate(a.date)}</td>
          <td>${esc(a.auditor)}</td><td class="num">${pair(pointsOf(a.overall), TOTAL_POINTS)}</td>
          <td><span class="chip ${a.overall >= S().passScore ? 'chip-ok' : a.overall >= S().warnScore ? 'chip-warn' : 'chip-bad'}">${a.overall}%</span></td>
          <td><button class="btn btn-outline btn-sm" data-action="view-audit" data-id="${a.id}">${icon('file', 13)}</button></td>
        </tr>`).join('') : `<tr><td colspan="7" class="muted">لا توجد زيارات في هذه الفترة.</td></tr>`}</tbody>
      </table></div>
    </section>` : `<section class="card"><div class="card-body"><p class="small muted">اختر المنطقة ثم المدينة ثم الفرع لعرض التقرير.</p></div></section>`}
    `;
  };

  /* ---------------- annual report ---------------- */
  VIEWS.report = function () {
    if (!ui.filters.report.branch) return emptyState('اختر فرعًا', 'اذهب إلى التقارير واختر المنطقة والمدينة والفرع');
    const b = branchById(ui.filters.report.branch);
    const rng = reportRange();
    const yr = rng.year, mode = rng.mode, month = ui.filters.report.month == null ? TODAY.getMonth() : Number(ui.filters.report.month);
    const isM = mode === 'monthly';
    let list = db.audits.filter(x => x.branchId === b.id && x.date >= rng.from && x.date <= rng.to);
    const a = list.slice().sort((x, y) => y.date.localeCompare(x.date))[0] || {};
    const periodLabel = mode === 'weekly'
      ? ('التقرير الأسبوعي — من ' + fmtDate(rng.from) + ' إلى ' + fmtDate(rng.to))
      : isM ? ('التقرير الشهري — ' + MONTHS[month] + ' ' + yr)
        : ('التقرير السنوي — ' + yr);
    const score = avgScore(list);
    const open = findingsOf(b.id).filter(f => f.status !== 'مغلق');

    const monthFindings = db.findings.filter(f => f.branchId === b.id && f.createdAt >= rng.from && f.createdAt <= rng.to);

    const sections = db.sections.map(s => {
      const v = list.length ? Math.round(list.reduce((sum, a) => sum + sectionScore(s, a.items).pct, 0) / list.length) : 0;
      return { label: s.name, value: v };
    });
    const trendList = auditsOf(b.id, null, yr);
    const months = [], vals = [];
    const activeMs = [...new Set(trendList.map(a => new Date(a.date).getMonth()))].sort((x, y) => x - y);
    (activeMs.length ? activeMs : [TODAY.getMonth()]).forEach(m => {
      const l = trendList.filter(a => new Date(a.date).getMonth() === m);
      months.push(MONTHS_SHORT[m]); vals.push(l.length ? avgScore(l) : 0);
    });
    const photos = list.flatMap(a => [
      ...Object.entries(a.photos || {}).map(([k, src]) => ({ src, cap: (itemById(k) || {}).text || 'صورة ميدانية' })),
      ...(a.extraPhotos || []).map(ph => ({ src: ph.src, cap: ph.caption || 'صورة إضافية' }))
    ]).slice(0, 12);

    const axisRows = db.sections.map(s => {
      let got = 0, max = 0;
      list.forEach(x => { const ss = sectionScore(s, x.items || {}); got += ss.got; max += ss.max; });
      return { s, got, max, pct: max ? Math.round(got / max * 100) : 0 };
    });
    const axisTotal = axisRows.reduce((t, r) => ({ got: t.got + r.got, max: t.max + r.max }), { got: 0, max: 0 });
    const totalPct = axisTotal.max ? Math.round(axisTotal.got / axisTotal.max * 100) : 0;

    const details = db.sections.map(sec => {
      const rows = scoredItems(sec).map(it => {
        let sum = 0, n = 0;
        list.forEach(x => { if (x.items && x.items[it.id] != null) { sum += x.items[it.id]; n++; } });
        return { it, n, avg: n ? sum / n : 0 };
      });
      const got = rows.reduce((s, r) => s + r.avg * (r.n || 1), 0);
      const max = rows.reduce((s, r) => s + 4 * (r.n || 1), 0);
      return { sec, rows, got, max, pct: max ? Math.round(got / max * 100) : 0 };
    });

    const typeRows = COVERAGE_ORDER.map(t => {
      const c = coverageFor(b.id, t, yr);
      return `<tr><td class="strong">${typeName(t)}</td><td class="num">${c.expected}</td><td class="num">${c.executed}</td>
        <td><span class="chip ${c.pct >= 90 ? 'chip-ok' : c.pct >= 70 ? 'chip-warn' : 'chip-bad'}">${c.pct}%</span></td></tr>`;
    }).join('');

    return `
    <div class="toolbar no-print">
      <button class="btn btn-outline" data-action="back-reports">${icon('arrowLeft', 16)} تغيير الفلتر</button>
      <div class="chip chip-gold" style="padding:8px 12px">${esc(b.name)} · ${esc(cityById(b.cityId).name)}</div>
      <div class="field" style="min-width:120px">
        <select class="select" data-filter="report.mode">
          <option value="weekly" ${mode === 'weekly' ? 'selected' : ''}>أسبوعي</option>
          <option value="monthly" ${mode === 'monthly' ? 'selected' : ''}>شهري</option>
          <option value="annual" ${mode === 'annual' ? 'selected' : ''}>سنوي</option>
        </select></div>
      ${isM ? `<div class="field" style="min-width:110px"><select class="select" data-filter="report.month">
        ${MONTHS.map((m, i) => `<option value="${i}" ${month === i ? 'selected' : ''}>${m}</option>`).join('')}
      </select></div>` : ''}
      <div class="spacer"></div>
      <button class="btn btn-outline" data-action="export-csv" data-kind="period">${icon('download', 16)} CSV</button>
      <button class="btn btn-outline" data-action="word-period">${icon('file', 16)} Word</button>
      <button class="btn btn-primary" data-action="print">${icon('print', 16)} طباعة / PDF</button>
    </div>

    <article class="card report-sheet rep-${isM ? 'monthly' : 'annual'}" id="annualReport">
      <header class="report-head">
        <img src="${esc(S().logo)}" class="report-logo" alt="سنام">
        <div style="flex:1">
          <div class="tiny muted" style="letter-spacing:1px">${esc(S().serviceName)}</div>
          <h2>${periodLabel}</h2>
          <p class="small muted">${esc(S().companyName)} — ${esc(S().tagline)}</p>
        </div>
      </header>

      <section class="report-meta">
        <div>
          <h3 class="rep-branch">${esc(b.name.includes(cityById(b.cityId).name) ? b.name : cityById(b.cityId).name + ' — ' + b.name)}</h3>
          <table class="tbl meta-tbl"><tbody>
            <tr><td class="muted">مدير الفرع</td><td>${esc(b.manager)}</td><td class="muted">المنطقة / المدينة</td><td>${esc(regionById(b.regionId).name)} — ${esc(cityById(b.cityId).name)}</td></tr>
            <tr><td class="muted">كود الفرع</td><td class="num">${b.code}</td><td class="muted">تاريخ الإصدار</td><td class="num">${fmtDate('2026-11-06')}</td></tr>
            <tr><td class="muted">عدد الزيارات</td><td class="num">${list.length}</td><td class="muted">نوع التقرير</td><td>${isM ? 'شهري' : 'سنوي'}</td></tr>
          </tbody></table>
        </div>
        <div class="report-score">
          <div class="score-title">${isM ? 'تقييم شهر ' + MONTHS[month] + ' ' + yr : 'تقييم سنة ' + yr}</div>
          <div class="score-ring-sm">
            ${ring(totalPct, 132, null, totalPct + '%')}
          </div>
        </div>
      </section>

      <h3 class="rep-h">درجات المحاور والمجموع</h3>
      <table class="tbl bordered axes-tbl"><thead><tr><th>المحور</th><th>الدرجة</th><th>النسبة</th><th>الحالة</th></tr></thead><tbody>
        ${axisRows.map(r => `<tr>
          <td class="strong">${esc(r.s.name)}</td>
          <td class="num">${pair(r.got, r.max)}</td>
          <td class="num">${r.pct}%</td>
          <td><span class="chip ${r.pct >= 85 ? 'chip-ok' : r.pct >= 70 ? 'chip-warn' : 'chip-bad'}">${r.pct >= 85 ? 'جيد' : r.pct >= 70 ? 'متوسط' : 'ضعيف'}</span></td>
        </tr>`).join('')}
        <tr class="axes-total">
          <td class="strong">المجموع</td>
          <td class="num"><b>${pair(axisTotal.got, axisTotal.max)}</b></td>
          <td class="num"><b>${totalPct}%</b></td>
          <td><span class="chip chip-gold"><b>${pointsOf(totalPct)} / ${TOTAL_POINTS}</b></span></td>
        </tr>
      </tbody></table>

      <h3 class="rep-h">تفاصيل البنود ودرجاتها</h3>
      ${details.map(d => `<div class="rep-section">
        <div class="rep-sec-head"><h3>${esc(d.sec.name)}</h3>
          <span class="chip chip-gold" dir="ltr">${d.got.toFixed(1)} / ${d.max} · ${d.pct}%</span></div>
        <table class="tbl compact bordered">
          <thead><tr><th style="width:40px">#</th><th>البند</th><th style="width:70px">الدرجة</th><th style="width:26%">الملاحظة</th></tr></thead>
          <tbody>${d.rows.map((r, i) => `<tr class="${r.avg <= 2 ? 'row-weak' : ''}">
            <td class="num muted">${i + 1}</td>
            <td>${esc(r.it.text)}</td>
            <td class="num"><b>${r.avg.toFixed(1)}</b>/4</td>
            <td class="muted small">${esc(list.length === 1 ? ((list[0].itemNotes || {})[r.it.id] || '—') : '—')}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`).join('')}

      <h3 class="rep-h">زيارات الشهر بالتفصيل</h3>
      <table class="tbl bordered"><thead><tr><th>الزيارة</th><th>النوع</th><th>التاريخ</th><th>المدقق</th><th>الدرجة</th><th>الحالة</th></tr></thead>
        <tbody>${list.length ? list.slice().sort((x, y) => x.date.localeCompare(y.date)).map(x => `<tr>
          <td class="num strong">${x.id}</td><td>${typeLabel(x)}</td><td class="num">${fmtDate(x.date)}</td>
          <td>${esc(x.auditor)}</td><td class="num">${pointsOf(x.overall)} / ${TOTAL_POINTS}</td>
          <td><span class="chip ${x.overall >= 85 ? 'chip-ok' : x.overall >= 70 ? 'chip-warn' : 'chip-bad'}">${x.overall}%</span></td></tr>`).join('')
          : '<tr><td colspan="6" class="muted">لا زيارات في هذا الشهر.</td></tr>'}</tbody></table>

      <h3 class="rep-h">ملاحظات الشهر</h3>
      ${monthFindings.length ? monthFindings.slice(0, 6).map(f => `<div class="mini-row"><span class="chip ${f.severity === 'حرج' ? 'chip-bad' : f.severity === 'عالي' ? 'chip-warn' : 'chip-gold'}">${f.severity}</span><span>${esc(f.title)}</span></div>`).join('') + (monthFindings.length > 6 ? `<p class="small muted" style="margin-top:2px">+ ${monthFindings.length - 6} ملاحظة أخرى في سجل الملاحظات.</p>` : '') : '<p class="small muted">لا ملاحظات.</p>'}

      ${photos.length ? `<section class="photo-appendix ${photos.length ? 'has-photos' : 'no-photos'}">
        <div class="pa-head">
          <div class="pa-brand">شركة سنام الرائدة — نظام الجودة</div>
          <h3>ملحق صور التقرير — ${esc(periodLabel)}</h3>
          <div class="pa-meta">الفرع: ${esc(b.name)} (${b.code}) · عدد الزيارات: ${list.length}</div>
        </div>
        <div class="photo-grid">${photos.map(ph => `<figure><img src="${ph.src}" alt=""><figcaption>${esc(ph.cap)}</figcaption></figure>`).join('')}</div>
      </section>` : ''}

      ${!isM ? `<h3 class="rep-h">تغطية خطة الزيارات</h3>
      <table class="tbl bordered"><thead><tr><th>نوع الزيارة</th><th>المستهدف</th><th>المنفذ</th><th>التغطية</th></tr></thead><tbody>${typeRows}</tbody></table>` : ''}

      <div class="report-stamp-row">
        ${stampHTML({ no: b.code + ' · ' + rng.from + ' — ' + rng.to, date: TODAY_ISO(), regionName: regionById(b.regionId).name, approved: list.length > 0 && list.every(x => x.approval === 'approved') })}
        <div class="stamp-qr">${qrSvg(location.origin + location.pathname + '#/report/' + b.id)}<span>امسح للتحقق من التقرير</span></div>
      </div>
      <div class="rep-signs">
        <div><span>مدير الجودة بالمنطقة</span><b>${esc(a.sealedBy || S().qualityManagerName || 'بندر بن مروعي محمد')}</b></div>
        <div><span>مدير التشغيل بالمنطقة</span><b>${esc(a.opsBy || (db.users.find(u => u.role === 'ops_manager' && u.regionId === b.regionId) || {}).name || 'ياسر أبو القاسم')}</b></div>
        <div><span>مدير التشغيل بشركة سنام</span><b>${esc(companyOpsName())}</b></div>
        <div><span>المدير التنفيذي</span><b>${esc(S().ceoName || ((db.users.find(u => u.role === 'ceo') || {}).name) || '—')}</b></div>
      </div>
    </article>`;
  };

  /* ---------------- audit report ---------------- */
  const canViewQr = (a) => {
    if (ui.qrMode) return true;
    const u = currentUser();
    if (!u || !a) return false;
    if (u.role === 'admin' || u.role === 'general_supervisor') return true;
    const b = branchById(a.branchId);
    if (u.role === 'quality_manager') return !u.regionId || u.regionId === 'all' || u.regionId === b.regionId;
    if (u.role === 'ops_manager') return !u.regionId || u.regionId === 'all' || u.regionId === b.regionId;
    return false;
  };
  function periodSummary(a, b) {
    const sameBranch = x => x.kind === 'bm' && x.branchId === a.branchId && x.id !== a.id;
    let rows = [], label = '', childType = '';
    if (a.type === 'bm_monthly') {
      const m = String(a.date).slice(0, 7);
      childType = 'bm_weekly';
      label = 'ملخص الشهر — تقارير الأسابيع';
      rows = db.audits.filter(x => sameBranch(x) && x.type === 'bm_weekly' && String(x.date).slice(0, 7) === m);
    } else if (a.type === 'bm_yearly') {
      const y = String(a.date).slice(0, 4);
      childType = 'bm_monthly';
      label = 'ملخص السنة — تقارير الأشهر';
      rows = db.audits.filter(x => sameBranch(x) && x.type === 'bm_monthly' && String(x.date).slice(0, 4) === y);
    } else {
      return '';
    }
    rows.sort((x, y2) => x.date.localeCompare(y2.date));
    const avg = rows.length ? Math.round(rows.reduce((t, x) => t + x.overall, 0) / rows.length) : 0;
    const total = rows.length ? Math.round((rows.reduce((t, x) => t + x.overall, 0) + a.overall) / (rows.length + 1)) : a.overall;
    return `<section class="card" style="margin:14px 0">
      <div class="card-head"><div><h3 class="section-title">${label}</h3>
        <p class="section-sub">${rows.length} تقرير ${childType === 'bm_weekly' ? 'أسبوعي' : 'شهري'} لنفس الفرع</p></div>
        <span class="chip chip-gold">معدل الفترة ${avg}%</span></div>
      <div class="card-body" style="padding:0">
        ${rows.length ? `<div class="tbl-wrap"><table class="tbl compact">
          <thead><tr><th>الرقم</th><th>التاريخ</th><th>النوع</th><th>الدرجة</th></tr></thead>
          <tbody>${rows.map(x => `<tr><td class="num" dir="ltr">${esc(x.id)}</td><td class="num">${fmtDate(x.date)}</td>
            <td>${esc(typeName(x.type))}</td><td class="num"><b>${x.overall}%</b></td></tr>`).join('')}
            <tr style="background:#F7F1E4"><td colspan="3"><b>المعدل</b></td><td class="num"><b>${avg}%</b></td></tr>
            <tr><td colspan="3"><b>المعدل مع هذا التقرير</b></td><td class="num"><b>${total}%</b></td></tr>
          </tbody></table></div>` : `<div style="padding:14px" class="small muted">لا توجد تقارير ${childType === 'bm_weekly' ? 'أسبوعية' : 'شهرية'} مسجلة لهذه الفترة بعد.</div>`}
      </div>
    </section>`;
  }

  VIEWS.audit = function () {
    const a = db.audits.find(x => x.id === ui.filters.auditId) || db.audits.slice().sort((x, y) => y.date.localeCompare(x.date))[0];
    if (!a) return emptyState('لا يوجد تقرير', 'ابدأ بزيارة جديدة');
    if (a.kind === 'inv') return invReport(a);
    if (ui.qrMode && !canViewQr(a)) return emptyState('غير مصرح', 'هذا الباركود مخصص لمدير الجودة ومدير التشغيل والإدارة العليا فقط');
    const b = branchById(a.branchId);
    const rec = scoreOfItems(a.items);
    const secs = SEC().filter(s => s.active !== false);
    const lows = [], highs = [];
    secs.forEach(s => scoredItems(s).forEach(it => {
      const v = a.items[it.id];
      if (v == null) return;
      if (v >= 4) highs.push({ it, sec: s });
      if (v <= 2) lows.push({ it, sec: s, v });
    }));
    const photos = [];
    const photoGroups = [];
    secs.forEach(s => scoredItems(s).forEach((it, i) => {
      const arr = photoList(a, it.id);
      if (!arr.length) return;
      photoGroups.push({ sec: s.name, no: i + 1, text: it.text, photos: arr });
      arr.forEach(src => photos.push([it.id, src]));
    }));
    const approved = a.approval === 'approved';
    const meRole = (currentUser() || {}).role || '';
    const qrLeftNote = (PUBLIC_MODE && QR_LEFT !== null) ? `<div class="tiny muted" style="text-align:center;margin-top:6px">عرض عام — يتبقى ${QR_LEFT} فتحة من أصل ${QR_LEFT + 1}</div>` : '';

    const sg = a.signatures || {};
    const opsUser = db.users.find(u => u.role === 'ops_manager' && (u.regionId === b.regionId || u.regionId === 'all'));
    const ceoUser = db.users.find(u => u.role === 'ceo' && u.active !== false);
    const sigCell = (title, s0, fallback, pendingText) => `<div>${title}<br><span>${esc(s0.by || fallback || '—')}</span>${s0.img ? `<img class="sig-img" src="${s0.img}" alt="">` : ''}<div class="tiny muted" style="margin-top:4px">${s0.at ? fmtDate(s0.at) : pendingText}</div></div>`;
    const sigBlock = `<div class="signatures">
      ${sigCell('مدير الجودة', sg.quality || {}, S().qualityManagerName, 'لم يُوقّع بعد')}
      ${sigCell('مدير التشغيل بالمنطقة ' + regionById(b.regionId).name, sg.ops || {}, (opsUser || {}).name, 'لم يُوقّع بعد')}
      ${sigCell('مدير التشغيل بشركة سنام', {}, companyOpsName(), '—')}
      ${sigCell('المدير التنفيذي', {}, S().ceoName || (ceoUser || {}).name || '—', '—')}
    </div>`;

    const itemTables = secs.map((s, si) => {
      const ss = sectionScore(s, a.items);
      return `<div class="rep-section">
        <div class="rep-sec-head"><h3>${si + 1}. ${esc(s.name)}</h3><span class="chip chip-gold">${ss.got} / ${ss.max} · ${ss.pct}%</span></div>
        <table class="tbl compact bordered">
          <thead><tr><th style="width:42px">#</th><th>البند</th><th style="width:64px">الدرجة</th><th style="width:30%">الملاحظة</th></tr></thead>
          <tbody>${scoredItems(s).map((it, i) => {
            const v = a.items[it.id] == null ? 4 : a.items[it.id];
            return `<tr class="${v <= 2 ? 'row-weak' : ''}">
              <td class="num muted">${i + 1}</td>
              <td>${esc(it.text)}</td>
              <td class="num"><b>${v}</b>/4</td>
              <td class="muted small">${esc((a.itemNotes || {})[it.id] || '—')}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;
    }).join('');

    return `
    <div class="toolbar no-print">
      <button class="btn btn-outline" data-action="back-visits">${icon('arrowLeft', 16)} رجوع</button>
      <div class="spacer"></div>
      ${canEditVisit(a) ? `<button class="btn btn-outline" data-action="edit-audit" data-id="${a.id}">${icon('edit', 16)} تعديل</button>` : ''}
      ${(isAdmin() || (canEditVisit(a) && !approved)) ? `<button class="btn btn-danger" data-action="delete-audit" data-id="${a.id}">${icon('trash', 16)} حذف التقرير</button>` : ''}
      <button class="btn btn-outline" data-action="word-photos" data-id="${a.id}">${icon('file', 16)} Word — الملحق</button>
      <button class="btn btn-outline" data-action="print-photos">${icon('camera', 16)} الملحق المصور</button>
      <button class="btn btn-outline" data-action="word-written" data-id="${a.id}">${icon('file', 16)} Word</button>
      <button class="btn btn-outline" data-action="download-pdf">${icon('download', 16)} تحميل PDF</button>
      <button class="btn btn-primary" data-action="print-written">${icon('print', 16)} طباعة التقرير</button>
    </div>

    ${a.returnReason && a.approval !== 'approved' ? `<div class="note no-print" style="margin-bottom:10px;border-color:#E3C68C;background:#FDF6E7">
      ${icon('alert', 16)}<span><b>أُعيد التقرير:</b> ${esc(a.returnReason)}${a.returnedBy ? ' — ' + esc(a.returnedBy) : ''}${a.returnedAt ? ' · ' + fmtDate(a.returnedAt) : ''}</span></div>` : ''}

    <div class="approval-bar no-print">
      ${approved
        ? `<span class="chip chip-ok">${icon('check', 13)} معتمد ومختوم${a.sealedBy ? ' — ' + esc(a.sealedBy) : ''}</span>`
        : `<span class="chip ${a.approval === 'pending_final' ? 'chip-warn' : a.approval === 'ready_stamp' ? 'chip-gold' : 'chip-muted'}">${esc(STAGE_LABEL(a))}</span>`}
      <div class="spacer"></div>
      ${isQM() && (!a.approval || a.approval === 'draft')
        ? `<button class="btn btn-primary btn-sm" data-action="send-ops" data-id="${a.id}">${icon('upload', 15)} توقيع وإرسال للاعتماد</button>` : ''}
      ${meRole === 'ops_manager' && ['pending_ops', 'pending_ceo', 'pending_final'].includes(a.approval)
        ? `<button class="btn btn-gold btn-sm" data-action="ops-approve" data-id="${a.id}">${icon('shield', 15)} التوقيع والاعتماد النهائي</button>` : ''}
      ${isQM() && a.approval === 'ready_stamp'
        ? `<button class="btn btn-primary btn-sm" data-action="seal-approve" data-id="${a.id}">${icon('check', 15)} ختم واعتماد نهائي</button>` : ''}
    </div>

    <article class="card report-sheet" id="auditReport">
      <header class="report-head">
        <img src="${esc(S().logo)}" class="report-logo" alt="سنام">
        <div style="flex:1">
          <div class="tiny muted" style="letter-spacing:1px">${esc(S().serviceName)}</div>
          <h2>${a.kind === 'bm' ? 'تقييم مدير فرع — ' + typeName(a.type) : a.surprise ? 'تقرير زيارة ' + typeName(a.type) + ' مفاجأة' : a.type === 'monthly' ? 'التقرير الشهري المفصل — ' + MONTHS[new Date(a.date + 'T00:00:00').getMonth()] + ' ' + new Date(a.date + 'T00:00:00').getFullYear() : 'تقرير زيارة رقابية — ' + typeName(a.type)}</h2>
          <p class="small muted">${esc(S().companyName)} — ${esc(S().tagline)}</p>
        </div>
      </header>

      <section class="report-meta">
        <div>
          <h3 style="font-size:16px;font-weight:600">${esc(b.name.includes(cityById(b.cityId).name) ? b.name : cityById(b.cityId).name + ' — ' + b.name)}</h3>
          <table class="tbl" style="font-size:12.5px;margin-top:8px"><tbody>
            <tr><td class="muted" style="padding:5px 0;width:38%">المنطقة</td><td>${esc(regionById(b.regionId).name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">المدينة</td><td>${esc(cityById(b.cityId).name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">الفرع</td><td>${esc(b.name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">مدير الفرع</td><td>${esc(b.manager)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">المدقق</td><td>${esc(a.auditor)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">نوع الزيارة</td><td>${typeLabel(a)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">رقم التقرير</td><td class="num" dir="ltr" style="text-align:start">${a.id}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الزيارة</td><td class="num">${fmtDate(a.date)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">وقت الزيارة</td><td class="num" dir="ltr">${visitTimeOf(a)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الاعتماد</td><td class="num">${approvalDateOf(a)}</td></tr>
          </tbody></table>
        </div>
        <div class="report-score">
          <div class="tiny muted">الدرجة النهائية</div>
          <div class="big-score num" dir="ltr" style="color:${a.overall >= 85 ? 'var(--ok)' : a.overall >= 70 ? 'var(--warn)' : 'var(--bad)'}">${pointsOf(a.overall)}<span>/ ${maxPoints()}</span></div>
          <div class="chip ${a.overall >= 85 ? 'chip-ok' : a.overall >= 70 ? 'chip-warn' : 'chip-bad'}">${a.overall}% · ${a.overall >= 85 ? 'اجتياز' : a.overall >= 70 ? 'تحت المتابعة' : 'غير مطابق'}</div>
          <div class="stat-line"><span>الدرجة المحققة</span><b>${pair(rec.got, rec.max)}</b></div>
          ${a.kind === 'bm' ? `<div class="stat-line"><span>المعدل العام للزيارات</span><b>${(() => {
            const list = db.audits.filter(x => x.kind === 'bm' && x.branchId === a.branchId);
            return list.length ? Math.round(list.reduce((t, x) => t + x.overall, 0) / list.length) + '%' : '—';
          })()}</b></div>` : ''}
        </div>
      </section>

      ${a.kind === 'bm' ? periodSummary(a, b) : ''}
      <h2 class="rep-title">تفاصيل التقييم — ${totalActiveItems()} بندًا</h2>
      ${itemTables}

      ${(a.extraPhotos || []).length ? `<section class="photo-appendix extra-photos-report no-print-break">
        <div class="pa-head">
          <div class="pa-brand">شركة سنام الرائدة — نظام الجودة</div>
          <h3>صور إضافية — زيارة ${esc(a.id)}</h3>
          <div class="pa-meta">الفرع: ${esc(b.name)} (${b.code}) · التاريخ: ${fmtDate(a.date)}</div>
        </div>
        <div class="photo-grid">${(a.extraPhotos || []).map(ph => `<figure><img src="${ph.src}" alt=""><figcaption>${esc(ph.caption || 'بدون شرح')}</figcaption></figure>`).join('')}</div>
      </section>` : ''}

      <h2 class="rep-title">النتيجة النهائية</h2>
      <table class="tbl bordered"><thead><tr><th>المحور</th><th>الدرجة</th><th>النسبة</th><th>الحالة</th></tr></thead>
        <tbody>${secs.map(s => {
          const ss = sectionScore(s, a.items);
          return `<tr><td class="strong">${esc(s.name)}</td><td class="num">${pair(ss.got, ss.max)}</td>
            <td class="num">${ss.pct}%</td>
            <td><span class="chip ${ss.pct >= 85 ? 'chip-ok' : ss.pct >= 70 ? 'chip-warn' : 'chip-bad'}">${ss.pct >= 85 ? 'جيد' : ss.pct >= 70 ? 'متوسط' : 'ضعيف'}</span></td></tr>`;
        }).join('')}</tbody></table>

      <div class="two-col" style="margin-top:20px">
        <div>
          <h3 class="rep-h">${icon('thumbUp', 16)} نقاط القوة</h3>
          ${highs.length ? `<ul class="point-list good">${highs.slice(0, 8).map(h => `<li>${esc(h.it.text)}</li>`).join('')}</ul>` : '<p class="small muted">لا توجد بنود بالدرجة الكاملة.</p>'}
        </div>
        <div>
          <h3 class="rep-h">${icon('thumbDown', 16)} نقاط الضعف</h3>
          ${lows.length ? `<ul class="point-list bad">${lows.slice(0, 10).map(l => `<li><span>${esc(l.it.text)}</span><b>${l.v}/4</b></li>`).join('')}</ul>` : '<p class="small muted">لا توجد نقاط ضعف مسجلة.</p>'}
        </div>
      </div>

      <h3 class="rep-h">الأداء حسب المحاور</h3>
      <div class="chart-box">${lineChart(secs.map((s, i) => ['العاملون', 'الغذاء', 'المنتج', 'الخدمة', 'المظهر', 'المعدات', 'الصالة', 'السلامة'][i] || String(i + 1)), secs.map(s => sectionScore(s, a.items).pct), { label: 'المحاور', min: 0 })}</div>

      ${a.notes || a.recommendations ? `<h3 class="rep-h">التقييم العام والتوصيات</h3>
        ${a.notes ? `<p class="small" style="margin-bottom:6px"><b>ملاحظات:</b> ${esc(a.notes)}</p>` : ''}
        ${a.recommendations ? `<p class="small"><b>التوصيات:</b> ${esc(a.recommendations)}</p>` : ''}` : ''}

      <div class="report-stamp-row">
        ${stampHTML({ no: 'زيارة ' + a.id, date: a.date, regionName: regionById(b.regionId).name, approved: a.approval === 'approved' })}
        <div class="stamp-qr">${qrSvg(location.origin + location.pathname + '#/audit/' + a.id + '?qr=1')}<span>امسح للتحقق من الزيارة</span></div>
      </div>
      ${qrLeftNote}
      ${(!PUBLIC_MODE && ['admin','quality_manager','ops_manager','general_supervisor'].includes(meRole)) ? `<div class="no-print" style="text-align:center;margin:10px 0">
        <button class="btn btn-outline btn-sm" data-action="qr-limit" data-id="${a.id}">${icon('lock', 14)} مرات فتح الباركود</button>
        <span class="tiny muted" id="qrUsage-${a.id}"></span>
      </div>` : ''}
      ${sigBlock}

    </article>

    <article class="card report-sheet" id="photoReport" style="margin-top:18px">
      <header class="report-head">
        <img src="${esc(S().logo)}" class="report-logo" alt="سنام">
        <div style="flex:1">
          <div class="tiny muted" style="letter-spacing:1px">${esc(S().serviceName)}</div>
          <h2>التقرير المصور — زيارة ${esc(a.id)}</h2>
          <p class="small muted">${esc(S().companyName)} — ${esc(S().tagline)}</p>
        </div>
      </header>

      <section class="report-meta">
        <div>
          <h3 style="font-size:16px;font-weight:600">${esc(b.name.includes(cityById(b.cityId).name) ? b.name : cityById(b.cityId).name + ' — ' + b.name)}</h3>
          <table class="tbl" style="font-size:12.5px;margin-top:8px"><tbody>
            <tr><td class="muted" style="padding:5px 0;width:38%">المنطقة</td><td>${esc(regionById(b.regionId).name)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">مدير الفرع</td><td>${esc(b.manager)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">المدقق</td><td>${esc(a.auditor)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">نوع الزيارة</td><td>${typeLabel(a)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">رقم التقرير</td><td class="num" dir="ltr" style="text-align:start">${a.id}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الزيارة</td><td class="num">${fmtDate(a.date)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">وقت الزيارة</td><td class="num" dir="ltr">${visitTimeOf(a)}</td></tr>
            <tr><td class="muted" style="padding:5px 0">تاريخ الاعتماد</td><td class="num">${approvalDateOf(a)}</td></tr>
          </tbody></table>
        </div>
        <div class="report-score">
          <div class="tiny muted">ملحق مصور</div>
          <div class="big-score num" dir="ltr">${photos.length}<span> صورة</span></div>
          <div class="chip chip-gold">${photoGroups.length} بند مصور</div>
        </div>
      </section>

      ${photoGroups.length ? photoGroups.map(g => `<div class="rep-section">
        <div class="rep-sec-head"><h3>البند ${g.no} — ${esc(g.sec)}</h3><span class="chip chip-gold">${g.photos.length} صورة</span></div>
        <p class="small" style="margin:0 0 8px">${esc(g.text)}</p>
        <div class="photo-grid appendix">${g.photos.map((src, pi) => `<figure><img src="${src}" alt=""><figcaption>صورة ${pi + 1} — البند رقم ${g.no}</figcaption></figure>`).join('')}</div>
      </div>`).join('') : `<p class="small muted" style="padding:12px 0">لا توجد صور مرفقة بهذه الزيارة.</p>`}

      <div class="report-stamp-row">
        ${stampHTML({ no: 'زيارة ' + a.id, date: a.date, regionName: regionById(b.regionId).name, approved: a.approval === 'approved' })}
        <div class="stamp-qr">${qrSvg(location.origin + location.pathname + '#/audit/' + a.id + '?qr=1')}<span>امسح للتحقق من الزيارة</span></div>
      </div>
      ${sigBlock}
    </article>`;
  };

  /* ---------------- users ---------------- */
  VIEWS.users = function () {
    if (!isAdmin()) return emptyState('غير مصرح', 'صفحة المستخدمين لمدير لوحة التحكم فقط');
    const list = db.users.slice().sort((x, y) => (x.active === y.active ? 0 : x.active ? -1 : 1));
    return `
    <div class="toolbar no-print">
      <div class="chip chip-gold">${db.users.filter(u => u.active !== false).length} مستخدم مفعّل</div>
      <div class="chip chip-muted">${db.users.length} إجمالي</div>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="add-user">${icon('plus', 16)} مستخدم جديد</button>
    </div>
    <section class="card">
      <div class="card-head"><div><h3 class="section-title">الحسابات والأدوار</h3>
        <p class="section-sub">مدير الجودة يضيف ويعدّل ويحذف. البقية يشاهدون التقارير حسب نطاقهم.</p></div></div>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>الاسم</th><th>اسم الدخول</th><th>الدور</th><th>النطاق</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${list.map(u => `<tr class="${u.active === false ? 'row-off' : ''}">
          <td><a class="strong" href="javascript:void(0)" data-action="user-perms" data-id="${u.id}" style="color:inherit;text-decoration:none;border-bottom:1px dashed #c9b98f">${esc(u.name || 'بدون اسم')}</a>
            <div class="sub">${u.username === session ? 'أنت' : ''}${u.perms ? ' · <span class="chip chip-gold" style="font-size:10px">صلاحيات مخصّصة</span>' : ''}</div></td>
          <td class="num" dir="ltr" style="text-align:start">${esc(u.username)}</td>
          <td>${roleLabel(u.role)}</td>
          <td>${u.regionId === 'all' ? 'كل المناطق' : esc(regionById(u.regionId).name)}</td>
          <td>${u.active === false ? '<span class="chip chip-muted">موقوف</span>' : '<span class="chip chip-ok"><i class="d"></i>مفعّل</span>'}</td>
          <td><div class="row" style="justify-content:flex-end;gap:4px">
            ${u.protected ? `<span class="tiny muted">حساب احتياطي — لا يُعدّل</span>` : `
            <button class="icon-btn sm" data-action="user-perms" data-id="${u.id}" title="الصلاحيات">${icon('shield', 14)}</button>
            <button class="icon-btn sm" data-action="edit-user" data-id="${u.id}" title="تعديل">${icon('edit', 14)}</button>
            <button class="icon-btn sm" data-action="toggle-user" data-id="${u.id}" title="${u.active === false ? 'تفعيل' : 'إيقاف'}">${u.active === false ? icon('check', 14) : icon('x', 14)}</button>
            <button class="icon-btn sm" data-action="delete-user" data-id="${u.id}" title="حذف">${icon('trash', 14)}</button>`}
          </div></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </section>`;
  };

  function signAudit(a, slot) {
    const u = currentUser() || {};
    a.signatures = a.signatures || {};
    a.signatures[slot] = {
      by: u.name || (u.role === 'ceo' ? 'المدير التنفيذي' : roleLabel(u.role)),
      img: u.signature || '',
      at: TODAY_ISO()
    };
  }

  function openSignatureModal() {
    const u = currentUser();
    if (!u) { toast('سجّل الدخول أولًا', 'err'); return; }
    openModal(`<div class="modal-head"><div><h2>توقيعي الإلكتروني</h2>
        <p>${esc(u.name || u.username)} — ${esc(roleLabel(u.role))}</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body">
        ${u.signature ? `<div class="sig-box"><img src="${u.signature}" alt="التوقيع"></div>`
          : `<p class="small muted">ما عندك توقيع مرفوع بعد. ارفع صورة توقيعك (يفضّل خلفية بيضاء) وسيظهر تحت اسمك تلقائيًا في التقارير.</p>`}
        <div class="row" style="gap:8px;margin-top:14px">
          <label class="btn btn-primary btn-sm">${icon('upload', 15)} رفع صورة التوقيع
            <input type="file" accept="image/*" data-sig hidden></label>
          ${u.signature ? `<button class="btn btn-danger btn-sm" data-action="clear-signature">${icon('trash', 14)} حذف التوقيع</button>` : ''}
        </div>
        <p class="tiny muted" style="margin-top:12px">التوقيع يُحفظ في حسابك، ويُنزل تلقائيًا أسفل اسمك عند الإرسال أو الاعتماد.</p>
      </div>`, { size: 'sm' });
  }

  function handleSignature(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const u = currentUser();
    if (!u) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const max = 600;
        const ratio = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * ratio);
        c.height = Math.round(img.height * ratio);
        const g = c.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        g.drawImage(img, 0, 0, c.width, c.height);
        u.signature = c.toDataURL('image/jpeg', 0.82);
        save(); closeModal(); openSignatureModal();
        toast('تم حفظ توقيعك — سيظهر تحت اسمك في التقارير');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  let pendingAdImg = null;
  let adEditingId = null;
  function openAdModal(id, draft) {
    const a = (S().ads || []).find(x => x.id === id) || null;
    adEditingId = a ? a.id : null;
    pendingAdImg = draft && draft.img !== undefined ? draft.img : (a ? a.img || null : null);
    const vTitle = draft ? draft.title : (a ? a.title : '');
    const vText = draft ? draft.text : (a ? (a.text || '') : '');
    const vStart = a && a.start ? a.start : '';
    const vEnd = a && a.end ? a.end : '';
    const vActive = a ? a.active !== false : true;
    openModal(`<div class="modal-head"><div><h2>${a ? 'تعديل إعلان' : 'إعلان جديد'}</h2>
        <p>يظهر في الصفحة الرئيسية خلال الفترة المحددة</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field full"><label>عنوان الإعلان</label><input class="input" id="adTitle" value="${esc(vTitle)}" placeholder="زيارة المشرف العام — فرع جيزان"></div>
        <div class="field full"><label>نص الإعلان (حتى ١٠٠٠ حرف)</label>
          <textarea class="textarea" id="adText" maxlength="1000" style="min-height:140px" placeholder="اكتب نص الإعلان…">${esc(vText)}</textarea>
          <span class="hint" id="adCount">${(vText || '').length} / 1000</span></div>
        <div class="field full"><label>الصورة</label>
          <div class="row" style="gap:8px;align-items:center">
            <label class="btn btn-outline btn-sm">${icon('upload', 14)} رفع صورة<input type="file" accept="image/*" data-ad-img hidden></label>
            <span class="small muted">${pendingAdImg ? 'صورة مرفوعة' : 'لا توجد صورة'}</span>
          </div>
          ${pendingAdImg ? `<img src="${pendingAdImg}" style="max-width:240px;border-radius:10px;margin-top:8px" alt="">` : ''}
        </div>
        <div class="field full"><label>رابط الإعلان (اختياري)</label>
          <input class="input" id="adLink" dir="ltr" value="${esc(a ? (a.link || '') : '')}" placeholder="https://www.tiktok.com/@.../video/...">
          <span class="hint">يفتح عند الضغط على الإعلان — يعمل مع تيك توك، إنستغرام، يوتيوب، وأي رابط.</span></div>
        <div class="field"><label>يبدأ الظهور</label><input class="input num" type="datetime-local" id="adStart" value="${esc(vStart)}"></div>
        <div class="field"><label>ينتهي الظهور</label><input class="input num" type="datetime-local" id="adEnd" value="${esc(vEnd)}"></div>
        <div class="field full"><label class="row" style="gap:8px"><input type="checkbox" id="adActive" ${vActive ? 'checked' : ''}> الإعلان مفعّل</label></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div>
        ${a ? `<button class="btn btn-danger" data-action="delete-ad" data-id="${a.id}">${icon('trash', 14)} حذف</button>` : ''}
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-ad" data-id="${a ? a.id : ''}">${icon('check', 15)} حفظ</button></div>`);
  }

  function saveAd(id) {
    const title = (qs('#adTitle').value || '').trim();
    const text = (qs('#adText').value || '').trim();
    const link = ((qs('#adLink') || {}).value || '').trim();
    const start = qs('#adStart').value || '';
    const end = qs('#adEnd').value || '';
    const active = qs('#adActive').checked;
    if (!title) { toast('اكتب عنوان الإعلان', 'err'); return; }
    if (text.length > 1000) { toast('النص أطول من ١٠٠٠ حرف', 'err'); return; }
    const s = S();
    s.ads = s.ads || [];
    if (id) {
      const a = s.ads.find(x => x.id === id);
      if (a) Object.assign(a, { title, text, link, start, end, active, img: pendingAdImg || '' });
    } else {
      s.ads.push({ id: 'ad' + Date.now(), title, text, link, start, end, active, img: pendingAdImg || '' });
    }
    save(); closeModal(); render(); toast('تم حفظ الإعلان');
  }

  let pendingFeatureImg = null;
  let featureEditingId = null;
  function openFeatureModal(id, draft) {
    const f = (S().featured || []).find(x => x.id === id) || null;
    featureEditingId = f ? f.id : null;
    pendingFeatureImg = draft && draft.img !== undefined ? draft.img : (f ? f.img || null : null);
    const vTitle = draft ? draft.title : (f ? f.title : '');
    const vText = draft ? draft.text : (f ? (f.text || '') : '');
    openModal(`<div class="modal-head"><div><h2>${f ? 'تعديل بطاقة' : 'بطاقة جديدة'}</h2>
        <p>زيارات المشرف العام والمدير التنفيذي</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field full"><label>العنوان</label><input class="input" id="fTitle" value="${esc(vTitle)}" placeholder="مثال: زيارة المدير التنفيذي — فرع جيزان"></div>
        <div class="field full"><label>مقال بسيط</label><textarea class="textarea" id="fText" placeholder="سطران أو ثلاثة…">${esc(vText)}</textarea></div>
        <div class="field full"><label>الصورة</label>
          <div class="row" style="gap:8px;align-items:center">
            <label class="btn btn-outline btn-sm">${icon('upload', 14)} رفع صورة<input type="file" accept="image/*" data-feature-img hidden></label>
            <span class="small muted" id="fImgState">${pendingFeatureImg ? 'صورة مرفوعة' : 'لا توجد صورة'}</span>
          </div>
          ${pendingFeatureImg ? `<img src="${pendingFeatureImg}" style="max-width:220px;border-radius:10px;margin-top:8px" alt="">` : ''}
        </div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div>
        ${f ? `<button class="btn btn-danger" data-action="delete-feature" data-id="${f.id}">${icon('trash', 14)} حذف</button>` : ''}
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-feature" data-id="${f ? f.id : ''}">${icon('check', 15)} حفظ</button></div>`);
  }

  function saveFeature(id) {
    const title = (qs('#fTitle').value || '').trim();
    const text = (qs('#fText').value || '').trim();
    if (!title) { toast('اكتب عنوان البطاقة', 'err'); return; }
    const s = S();
    s.featured = s.featured || [];
    if (id) {
      const f = s.featured.find(x => x.id === id);
      if (f) { f.title = title; f.text = text; f.img = pendingFeatureImg || ''; }
    } else {
      s.featured.push({ id: 'ft' + Date.now(), title, text, img: pendingFeatureImg || '' });
    }
    save(); closeModal(); render(); toast('تم حفظ البطاقة');
  }

  function openReturnModal(id) {
    const a = db.audits.find(x => x.id === id); if (!a) return;
    openModal(`<div class="modal-head"><div><h2>إعادة التقرير</h2><p>${esc(a.id)} — اكتب سبب الإعادة لصاحب التقرير</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="field"><label>سبب الإعادة</label>
        <textarea class="textarea" id="returnReason" placeholder="مثال: يلزم تعديل درجات بند النظافة وإضافة صور…"></textarea></div></div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="confirm-return" data-id="${id}">${icon('check', 15)} إعادة التقرير</button></div>`, { size: 'sm' });
  }

  function openUserModal(id) {
    const u = id ? db.users.find(x => x.id === id) : null;
    openModal(`<div class="modal-head"><div><h2>${u ? 'تعديل مستخدم' : 'مستخدم جديد'}</h2><p>الصلاحيات تُطبّق حسب الدور والنطاق</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>الاسم</label><input class="input" id="uName" value="${u ? esc(u.name) : ''}"></div>
        <div class="field"><label>اسم الدخول</label><input class="input num" id="uUser" dir="ltr" value="${u ? esc(u.username) : ''}"></div>
        <div class="field"><label>الدور</label><select class="select" id="uRole">
          ${Object.keys(ROLES).map(r => `<option value="${r}" ${u && u.role === r ? 'selected' : ''}>${ROLES[r]}</option>`).join('')}
        </select></div>
        <div class="field"><label>النطاق</label><select class="select" id="uRegion">
          <option value="all" ${u && u.regionId === 'all' ? 'selected' : ''}>كل المناطق</option>
          ${db.regions.map(r => `<option value="${r.id}" ${u && u.regionId === r.id ? 'selected' : ''}>${r.name}</option>`).join('')}
        </select></div>
        <div class="field full"><label>كلمة المرور ${u ? '(اتركها فارغة للإبقاء)' : ''}</label>
          <input class="input num" id="uPass" dir="ltr" placeholder="${u ? '••••••' : 'Snam@2026'}"></div>
        <div class="field full"><label class="row" style="gap:8px"><input type="checkbox" id="uActive" ${!u || u.active !== false ? 'checked' : ''}> الحساب مفعّل</label></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-user" data-id="${u ? u.id : ''}">${icon('check', 15)} حفظ</button></div>`);
  }

  async function saveUser(id) {
    const name = qs('#uName').value.trim();
    const username = qs('#uUser').value.trim().toLowerCase();
    const role = qs('#uRole').value;
    const regionId = qs('#uRegion').value;
    const pass = qs('#uPass').value.trim();
    const active = qs('#uActive').checked;
    if (!username) { toast('أدخل اسم الدخول', 'err'); return; }
    if (db.users.some(u => u.username === username && u.id !== id)) { toast('اسم الدخول مستخدم', 'err'); return; }
    const hash = pass ? await sha256(pass) : null;
    const h = await sbAuthHeaders();
    const rpc = async (fn, body) => {
      if (!h) return null;
      try { const r = await fetch(SB_URL + '/rest/v1/rpc/' + fn, { method: 'POST', headers: h, body: JSON.stringify(body) }); return r.ok ? await r.json().catch(() => true) : null; } catch (e) { return null; }
    };
    if (id) {
      const u = db.users.find(x => x.id === id);
      if (!u) { toast('المستخدم غير موجود', 'err'); return; }
      if (u.protected) { toast('حساب احتياطي محمي — لا يمكن تعديله', 'err'); return; }
      const oldUsername = u.username;
      Object.assign(u, { name, username, role, regionId, active });
      if (hash) {
        u.pass = hash;
        const res = await rpc('admin_set_password', { p_username: oldUsername, p_password: pass });
        if (res === true) toast('تم تحديث كلمة المرور');
        else toast('حُفظ محليًا — تعذّر تحديث كلمة المرور سحابيًا', 'err');
      }
    } else {
      const nid = 'u' + Date.now();
      db.users.push({ id: nid, name, username, role, regionId, active, pass: hash || await sha256('Snam@2026'), email: nid + '@snam.sa' });
      const uid = await rpc('admin_create_user', { p_key: nid, p_password: pass || 'Snam@2026' });
      if (uid) db.users[db.users.length - 1].email = nid + '@snam.sa';
      if (!uid) toast('أُنشئ محليًا — تعذّر إنشاء حساب سحابي', 'err');
    }
    save(); closeModal(); render(); toast('تم حفظ المستخدم' + (id ? '' : ' — يحتاج تفعيل الحساب السحابي'));
  }

  function toggleUser(id) {
    const u = db.users.find(x => x.id === id); if (!u) return;
    if (u.protected) { toast('حساب احتياطي محمي — لا يمكن إيقافه', 'err'); return; }
    if (u.username === session) { toast('لا يمكنك إيقاف حسابك الحالي', 'err'); return; }
    u.active = u.active === false;
    save(); render(); toast(u.active === false ? 'تم إيقاف الحساب' : 'تم تفعيل الحساب');
  }

  function deleteUser(id) {
    const u = db.users.find(x => x.id === id); if (!u) return;
    if (u.protected) { toast('حساب احتياطي محمي — لا يمكن حذفه', 'err'); return; }
    if (u.username === session) { toast('لا يمكنك حذف حسابك الحالي', 'err'); return; }
    if (db.users.filter(x => x.role === 'quality_manager' && x.active !== false).length <= 1 && u.role === 'quality_manager') {
      toast('يجب بقاء مدير جودة واحد على الأقل', 'err'); return;
    }
    if (!confirm('حذف المستخدم ' + (u.name || u.username) + '؟')) return;
    db.users = db.users.filter(x => x.id !== id);
    save(); render(); toast('تم حذف المستخدم');
  }

  /* ---------------- login ---------------- */
  let loginOpen = false;
  function rememberedUser() {
    try {
      const r = JSON.parse(localStorage.getItem('snam_remember') || 'null');
      if (!r || !r.username || !r.exp || Date.now() > r.exp) return null;
      return r;
    } catch (e) { return null; }
  }
  function openLogin() {
    loginOpen = true;
    const r = rememberedUser();
    openModal(`<div class="modal-head"><div><h2>تسجيل الدخول</h2><p>${esc(S().companyName)} — ${esc(S().serviceName)}</p></div></div>
      <div class="modal-body">
        <div class="field" style="margin-bottom:12px"><label>اسم الدخول</label><input class="input num" id="loginUser" dir="ltr" autocomplete="username" value="${r ? esc(r.username) : ''}"></div>
        <div class="field"><label>كلمة المرور</label>
          <div class="pass-wrap">
            <input class="input num" id="loginPass" type="password" dir="ltr" autocomplete="current-password">
            <button type="button" class="pass-eye" data-action="toggle-pass" aria-label="إظهار كلمة المرور">${icon('eye', 16)}</button>
          </div>
        </div>
        <label class="row" style="gap:8px;margin-top:12px;font-size:12.5px;cursor:pointer">
          <input type="checkbox" id="loginRemember" ${r ? 'checked' : ''}> احفظني على هذا الجهاز (لا يطلب كلمة المرور كل مرة)
        </label>
      </div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-primary" data-action="do-login">دخول ${icon('arrowLeft', 15)}</button></div>`, { size: 'sm', closable: false });
    setTimeout(() => { const i = qs(r ? '#loginPass' : '#loginUser'); if (i) i.focus(); }, 80);
  }

  async function doLogin() {
    const un = (qs('#loginUser').value || '').trim().toLowerCase();
    const pw = qs('#loginPass').value || '';
    const btn = qs('[data-action="do-login"]');
    if (btn) { btn.disabled = true; btn.textContent = 'جارٍ الدخول…'; }

    let remoteOk = false, networkError = false, loggedEmail = '';
    try {
      const res = await sbLogin(un, pw);
      loggedEmail = res.email || '';
      if (res.ok) {
        remoteOk = true;
        const data = await sbLoad();
        if (data) { db = data; ensureSettings(); localStorage.setItem(DBKEY, JSON.stringify(data)); }
      }
    } catch (e) { networkError = true; }

    const findUser = () => db.users.find(x => x.username === un || x.username === (un || '').split('@')[0]
      || (Array.isArray(x.aliases) && x.aliases.map(a => String(a).toLowerCase()).includes(un))
      || (loggedEmail && (x.email === loggedEmail || (x.id && (x.id + '@snam.sa') === loggedEmail)))
      || (loggedEmail && x.username && (loggedEmail === (x.username + '@snam.sa') || loggedEmail === (x.username + '@snam.sal')))
    );
    let u = findUser();
    if (!u && remoteOk) {
      try { const data2 = await sbLoad(); if (data2) { db = data2; ensureSettings(); u = findUser(); } } catch (e) { }
    }
    if (!u && remoteOk) {
      /* دخول ناجح لكن الملف غير متاح محليًا — نكمل بجلسة ناجحة */
      try {
        const emailLocal = loggedEmail || un;
        const uname = emailLocal.includes('@') ? emailLocal.split('@')[0] : emailLocal;
        session = uname;
        sessionStorage.setItem('snam_session', session);
        if (btn) { btn.disabled = false; btn.textContent = 'دخول'; }
        ui.pendingRoute = ui.pendingRoute || 'dashboard';
        closeModal(); render(); save(); startMaintenanceWatcher();
        toast('مرحبًا');
        return;
      } catch (e) { }
    }
    if (!u && !remoteOk) { toast('اسم الدخول غير موجود', 'err'); if (btn) { btn.disabled = false; btn.textContent = 'دخول'; } return; }
    if (u && u.active === false) { toast('الحساب موقوف — راجع مدير الجودة', 'err'); if (btn) { btn.disabled = false; btn.textContent = 'دخول'; } return; }

    if (!remoteOk) {
      if (!networkError) {
        /* رفض من السحابة: كلمة مرور خاطئة أو حساب غير مفعّل — لا نسمح بتجاوز محلي */
        toast('كلمة المرور غير صحيحة', 'err');
        if (btn) { btn.disabled = false; btn.textContent = 'دخول'; }
        return;
      }
      /* تعذّر الوصول للسحابة: تحقق محلي مؤقت (وضع عدم الاتصال) */
      const h = await sha256(pw);
      if (!u || h !== u.pass) { toast('تعذر الاتصال — تحقق من الشبكة', 'err'); if (btn) { btn.disabled = false; btn.textContent = 'دخول'; } return; }
    }

    session = u.username;
    sessionStorage.setItem('snam_session', session);
    sessionStorage.setItem('snam_demo', u.role === 'demo' ? '1' : '0');
    loginOpen = false;
    if ((u.role === 'demo') !== DEMO_MODE) { location.reload(); return; }
    ui.route = 'dashboard';
    try {
      const remember = qs('#loginRemember');
      if (remember && remember.checked) localStorage.setItem('snam_remember', JSON.stringify({ username: u.username, exp: Date.now() + 30 * 86400000 }));
      else localStorage.removeItem('snam_remember');
    } catch (e) { }
    ui.route = u.role === 'employee' ? 'me' : (ui.pendingRoute || 'dashboard');
    ui.pendingRoute = null;
    closeModal(); render(); save(); startMaintenanceWatcher();
    sbHeartbeat().then(loadPresence);
    if (!window.__presTimer) window.__presTimer = setInterval(() => { sbHeartbeat(); loadPresence(); }, 60000);
    toast('مرحبًا ' + (u.name || roleLabel(u.role)));
    sbDailyBackup();
  }

  async function saveMyProfile() {
    const u = currentUser(); if (!u) return;
    const h = await sbAuthHeaders(); if (!h) { toast('لا توجد جلسة سحابية', 'err'); return; }
    const body = {
      p_national_id: (qs('#pfId') || {}).value || '',
      p_issue: (qs('#pfIssue') || {}).value || null,
      p_expiry: (qs('#pfExpiry') || {}).value || null,
      p_nationality: (qs('#pfNat') || {}).value || ''
    };
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/update_my_profile', { method: 'POST', headers: h, body: JSON.stringify(body) });
      if (!r.ok) { toast('تعذّر حفظ البيانات', 'err'); return; }
      Object.assign(u, { nationalId: body.p_national_id, idIssue: body.p_issue || '', idExpiry: body.p_expiry || '', nationality: body.p_nationality });
      toast('تم حفظ بيانات الهوية');
    } catch (e) { toast('تعذّر الاتصال', 'err'); }
  }

  function openChangePass() {
    openModal(`<div class="modal-head"><h3>${icon('lock', 18)} تغيير كلمة المرور</h3><button class="icon-btn" data-action="close-modal">${icon('x', 18)}</button></div>
      <div class="modal-body">
        <p class="muted" style="margin-bottom:12px">تُحدَّث كلمة المرور في السحابة مباشرة — استخدمها في الدخول من أي جهاز.</p>
        <div class="field"><label>كلمة المرور الجديدة</label><input class="input" type="password" id="cpNew" autocomplete="new-password"></div>
        <div class="field"><label>تأكيد كلمة المرور</label><input class="input" type="password" id="cpNew2" autocomplete="new-password"></div>
      </div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-my-pass">${icon('check', 15)} حفظ</button></div>`, { size: 'sm', closable: true });
  }

  async function saveMyPass() {
    const a = qs('#cpNew').value || '', b = qs('#cpNew2').value || '';
    if (a.length < 6) { toast('كلمة المرور 6 أحرف على الأقل', 'err'); return; }
    if (a !== b) { toast('التأكيد لا يطابق', 'err'); return; }
    const h = await sbAuthHeaders();
    if (!h) { toast('لا توجد جلسة سحابية — أعد تسجيل الدخول', 'err'); return; }
    const r = await fetch(SB_URL + '/auth/v1/user', {
      method: 'PUT', headers: h, body: JSON.stringify({ password: a })
    });
    if (!r.ok) { toast('تعذر تحديث كلمة المرور', 'err'); return; }
    const u = currentUser();
    if (u) { u.pass = await sha256(a); save(); }
    closeModal(); toast('تم تحديث كلمة المرور');
  }

  async function logout() {
    try { if (sbSession) await fetch(SB_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + sbSession.access_token } }); } catch (e) { }
    localStorage.removeItem('snam_sb_session'); sbSession = null;
    sessionStorage.removeItem('snam_session');
    sessionStorage.removeItem('snam_demo');
    localStorage.removeItem('snam_remember');
    session = '';
    location.reload();
  }

  /* ---------------- settings ---------------- */
  VIEWS.ads = function () {
    if (!isManager()) return emptyState('غير مصرح', 'هذه الصفحة للإدارة فقط');
    const list = (S().ads || []);
    const now = Date.now();
    const stateOf = a => {
      if (a.active === false) return { t: 'موقوف', c: 'chip-muted' };
      if (a.start && new Date(a.start).getTime() > now) return { t: 'مجدول', c: 'chip-warn' };
      if (a.end && new Date(a.end).getTime() < now) return { t: 'منتهي', c: 'chip-muted' };
      return { t: 'ظاهر الآن', c: 'chip-ok' };
    };
    return `
    <div class="toolbar">
      <span class="chip chip-gold">${list.length} إعلان</span>
      <span class="chip chip-ok">${list.filter(a => stateOf(a).t === 'ظاهر الآن').length} ظاهر الآن</span>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="add-ad">${icon('plus', 16)} إعلان جديد</button>
    </div>
    ${list.length ? list.map(a => {
      const st = stateOf(a);
      return `<section class="card" style="margin-bottom:12px">
        <div class="ad-manage">
          <div class="ad-manage-img">${a.img ? `<img src="${a.img}" alt="">` : `<span class="muted tiny">بدون صورة</span>`}</div>
          <div class="ad-manage-body">
            <div class="row" style="gap:8px;align-items:center">
              <h3 class="section-title" style="margin:0">${esc(a.title || 'بدون عنوان')}</h3>
              <span class="chip ${st.c}">${st.t}</span>
            </div>
            <p class="small muted" style="margin:6px 0 0;white-space:pre-wrap">${esc(a.text || '')}</p>
            <div class="tiny muted" style="margin-top:8px">
              يبدأ: ${a.start ? a.start.replace('T', ' · ') : 'فورًا'} — ينتهي: ${a.end ? a.end.replace('T', ' · ') : 'بدون نهاية'}
            </div>
            ${a.link ? `<div class="tiny" style="margin-top:4px"><a href="${esc(a.link)}" target="_blank" rel="noopener" dir="ltr">${esc(a.link)}</a></div>` : ''}
          </div>
          <div class="row" style="gap:6px;align-items:flex-start">
            <button class="btn btn-outline btn-sm" data-action="edit-ad" data-id="${a.id}">${icon('edit', 14)} تعديل</button>
            <button class="btn btn-danger btn-sm" data-action="delete-ad" data-id="${a.id}">${icon('trash', 14)}</button>
          </div>
        </div>
      </section>`;
    }).join('') : emptyState('لا توجد إعلانات', 'أضف إعلانًا بصورة ونص وجدولة ظهور')}`;
  };

  VIEWS.settings = function () {
    if (!isAdmin()) return emptyState('غير مصرح', 'إعدادات الموقع لمدير لوحة التحكم فقط');
    const s = S();
    return `
    <form id="settingsForm" class="settings-grid" onsubmit="return false">
      <div class="settings-block">
        <section class="card settings-section">
          <h3>${icon('shield', 17)} نسخة النظام وسجل التحديثات</h3>
          <p class="desc">رقم النسخة الحالية، وسجل كل التحديثات السابقة — لمدير لوحة التحكم فقط.</p>
          <div class="row" style="gap:10px;flex-wrap:wrap;align-items:center">
            <a class="btn btn-gold btn-sm" href="#/changelog" target="_blank" rel="noopener">${icon('file', 14)} سجل التحديثات — <b dir="ltr">${APP_VERSION}</b></a>
            <span class="chip chip-muted" dir="ltr">${BUILD_DATE}</span>
            <button class="btn btn-outline btn-sm" data-action="hard-refresh">${icon('clock', 14)} تحديث الكاش وإعادة التحميل</button>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('clock', 17)} وضع التحديثات</h3>
          <p class="desc">عند التفعيل تظهر للعملاء شاشة «المنصة تحت التحديثات» مع عدّاد تنازلي، وقبلها بعشر دقائق شريط تنبيه أعلى كل الصفحات. الأدمن يرى الموقع طبيعيًا.</p>
          <label class="row" style="gap:8px;font-size:12.5px;margin-bottom:12px">
            <input type="checkbox" id="mEnabled" ${(s.maintenance || {}).enabled ? 'checked' : ''}> تفعيل وضع التحديثات
          </label>
          <div class="form-grid">
            <div class="field"><label>بداية التحديث</label><input class="input num" type="datetime-local" id="mStart" value="${esc((s.maintenance || {}).start || '')}"></div>
            <div class="field"><label>نهاية التحديث</label><input class="input num" type="datetime-local" id="mEnd" value="${esc((s.maintenance || {}).end || '')}"></div>
            <div class="field full"><label>النص الظاهر للعميل</label><input class="input" id="mMsg" value="${esc((s.maintenance || {}).msg || '')}"></div>
            <div class="field full"><label>حسابات مستثناة من الإغلاق (مفصولة بفاصلة)</label><input class="input" id="mAllow" value="${esc(((s.maintenance || {}).allow || ['الموارد البشرية', 'admin']).join(', '))}"></div>
          </div>
          <button class="btn btn-primary" style="margin-top:10px" data-action="save-maintenance">${icon('check', 15)} حفظ إعدادات التحديث</button>
          <div style="margin-top:16px;padding-top:14px;border-top:1px dashed var(--line,#e3ddd0)">
            <div class="small strong" style="margin-bottom:6px">${icon('alert', 14)} استعادة زيارات محذوفة</div>
            <p class="tiny muted" style="margin:0 0 8px">يبحث في نسخ هذا الجهاز عن زيارات غير موجودة في السحابة (مثل زيارات الجرد القديمة).</p>
            <button class="btn btn-outline btn-sm" data-action="rec-open">${icon('search', 14)} فحص نسخ الجهاز</button>
          </div>
          <div style="margin-top:16px;padding-top:14px;border-top:1px dashed var(--line,#e3ddd0)">
            <div class="row" style="align-items:center"><div class="small strong">${icon('shield', 14)} النسخ الاحتياطية السحابية</div><div class="spacer" style="flex:1"></div>
              <button class="btn btn-outline btn-sm" data-action="bk-load">تحديث</button></div>
            <p class="tiny muted" style="margin:6px 0 8px">نسخة تلقائية يوميًا من كل بيانات النظام (آخر 30 نسخة). الاستعادة لمدير المنصة فقط.</p>
            <div id="bkList"></div>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('building', 17)} هوية الشركة</h3>
          <p class="desc">تظهر في رأس النظام والتقارير المطبوعة.</p>
          <div class="form-grid">
            <div class="field"><label for="set-name">اسم الشركة</label><input class="input" id="set-name" value="${esc(s.companyName)}"></div>
            <div class="field"><label for="set-tagline">الوصف التعريفي</label><input class="input" id="set-tagline" value="${esc(s.tagline)}"></div>
            <div class="field"><label for="set-service">الخدمة المقدمة</label><input class="input" id="set-service" value="${esc(s.serviceName)}"><span class="hint">تظهر أسفل الشعار وفي عنوان الصفحة.</span></div>
            <div class="field"><label for="set-servicedesc">وصف الخدمة</label><input class="input" id="set-servicedesc" value="${esc(s.serviceDesc)}"></div>
            <div class="field"><label for="set-qm">مدير الجودة (في التوقيع)</label><input class="input" id="set-qm" value="${esc(s.qualityManagerName || '')}"></div>
            <div class="field"><label for="set-ceo">اسم المدير التنفيذي (في التوقيع)</label><input class="input" id="set-ceo" value="${esc((S().ceoName || ''))}"></div>
            <div class="field"><label for="set-sup">اسم المشرف العام</label><input class="input" id="set-sup" value="${esc(s.supervisorPersonName || '')}"><span class="hint">يظهر في توقيع «المشرف العام على شركة سنام» بالتقرير.</span></div>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('phone', 17)} بيانات التواصل</h3>
          <p class="desc">بيانات رسمية تظهر في التقارير.</p>
          <div class="form-grid">
            <div class="field"><label for="set-phone">رقم هاتف الشركة</label><input class="input num" id="set-phone" dir="ltr" value="${esc(s.phone)}"></div>
            <div class="field"><label for="set-whatsapp">واتساب</label><input class="input num" id="set-whatsapp" dir="ltr" value="${esc(s.whatsapp)}"></div>
            <div class="field"><label for="set-email">البريد الإلكتروني</label><input class="input" id="set-email" dir="ltr" value="${esc(s.email)}"></div>
            <div class="field"><label for="set-website">الموقع الإلكتروني</label><input class="input" id="set-website" dir="ltr" value="${esc(s.website)}"></div>
            <div class="field full"><label for="set-address">عنوان الشركة</label><input class="input" id="set-address" value="${esc(s.address)}"></div>
            <div class="field"><label for="set-hq">المقر الرئيسي</label><input class="input" id="set-hq" value="${esc(s.hq)}"></div>
            <div class="field"><label for="set-hours">ساعات العمل</label><input class="input" id="set-hours" value="${esc(s.workHours)}"></div>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('target', 17)} معايير التقييم</h3>
          <div class="form-grid">
            <div class="field"><label for="set-pass">حد الاجتياز (%)</label><input class="input num" id="set-pass" type="number" min="1" max="100" value="${s.passScore}"></div>
            <div class="field"><label for="set-warn">حد المتابعة (%)</label><input class="input num" id="set-warn" type="number" min="1" max="100" value="${s.warnScore}"></div>
            <div class="field"><label for="set-year">سنة العمل</label><input class="input num" id="set-year" type="number" min="2020" max="2100" value="${s.year}"></div>
            <div class="field"><label>الدرجة النهائية</label><input class="input num" value="${TOTAL_POINTS}" disabled></div>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('file', 17)} الصفحة الرئيسية</h3>
          <p class="desc">تظهر للزوار قبل تسجيل الدخول.</p>
          <div class="form-grid">
            <div class="field full"><label for="set-landing">نص تعريفي في الصفحة الرئيسية</label>
              <input class="input" id="set-landing" value="${esc(s.landingText || '')}" placeholder="نبذة قصيرة عن المنصة…"></div>
            <div class="field full"><label for="set-copy">نص الحقوق (أسفل الصفحة)</label>
              <input class="input" id="set-copy" value="${esc(s.copyrightText || 'حقوق المنصة ملكية رقميات@3026')}"></div>
            <div class="field full"><label for="set-copyurl">رابط الحقوق / موقع الشركة المالكة</label>
              <input class="input" id="set-copyurl" dir="ltr" value="${esc(s.copyrightUrl || '')}" placeholder="https://…">
              <span class="hint">عند الضغط على نص الحقوق يفتح هذا الرابط.</span></div>
          </div>
          <h3 style="margin-top:18px">${icon('camera', 17)} زيارات المشرف العام والمدير التنفيذي</h3>
          <p class="desc">بطاقات مصورة تظهر في الصفحة الرئيسية.</p>
          <div class="row" style="flex-wrap:wrap;gap:8px">
            ${(s.featured || []).map(f => `<button class="btn btn-outline btn-sm" data-action="edit-feature" data-id="${f.id}">${esc(f.title || 'بدون عنوان')}</button>`).join('') || '<span class="small muted">لا توجد بطاقات.</span>'}
            <button class="btn btn-primary btn-sm" data-action="add-feature">${icon('plus', 14)} إضافة بطاقة</button>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('shield', 17)} النسخ الاحتياطية</h3>
          <p class="desc">نسخة تلقائية عند كل تعديل (آخر ١٢ نسخة) + نسخة يدوية وتصدير ملف.</p>
          <div class="row" style="flex-wrap:wrap">
            <button class="btn btn-outline" data-action="open-backups">${icon('clock', 15)} عرض النسخ المحفوظة</button>
            <button class="btn btn-outline" data-action="backup-now">${icon('download', 15)} نسخة الآن</button>
            <button class="btn btn-outline" data-action="export-json">${icon('file', 15)} تنزيل ملف JSON</button>
          </div>
          <p class="hint" id="backupInfo" style="margin-top:8px">${lastBackupLabel()}</p>
          <div class="note" style="margin-top:12px">${icon('alert', 15)}<span>النسخ محفوظة داخل هذا المتصفح. للحماية الكاملة من فقدان الجهاز، نزّل ملف JSON دوريًا أو فعّل قاعدة البيانات السحابية.</span></div>
        </section>

        <section class="card settings-section">
          <h3>${icon('alert', 17)} إدارة المساحة</h3>
          <p class="desc">الجوال يحدّ مساحة التخزين للموقع. إذا ظهرت رسالة «المساحة ممتلئة»، اضغط الزر لضغط الصور القديمة.</p>
          <div class="row" style="flex-wrap:wrap;align-items:center;gap:10px">
            <span class="chip chip-muted">الحجم الحالي: ${dbSizeKB()} كيلوبايت</span>
            <button class="btn btn-outline" data-action="compress-photos">${icon('target', 15)} ضغط الصور وتوفير المساحة</button>
          </div>
        </section>

        <section class="card settings-section">
          <h3>${icon('file', 17)} إدارة البيانات</h3>
          <div class="row" style="flex-wrap:wrap">
            <button class="btn btn-outline" data-action="export-json">${icon('download', 15)} تصدير JSON</button>
            <label class="btn btn-outline" style="cursor:pointer">${icon('upload', 15)} استيراد
              <input type="file" accept="application/json" id="importJson" hidden></label>
            <button class="btn btn-danger" data-action="reset-demo">إعادة تعيين البيانات</button>
          </div>
        </section>

        ${isManager() ? `<div class="save-bar no-print">
          <span class="dot-unsaved" id="dirtyDot" hidden></span><span class="small" id="saveHint">كل التغييرات محفوظة</span>
          <div class="spacer"></div>
          <button class="btn btn-primary" data-action="save-settings">${icon('check', 15)} حفظ الإعدادات</button>
        </div>` : ''}
      </div>

      <aside style="display:flex;flex-direction:column;gap:16px">
        <section class="card settings-section">
          <h3>${icon('upload', 17)} شعار الشركة</h3>
          <div class="logo-box"><div class="on-dark"><img id="logoPreview" src="${esc(s.logo)}" alt="الشعار"></div>
            <div class="tiny muted">معاينة على الخلفية العنابية</div></div>
          <div class="upload-row">
            <label class="btn btn-outline btn-sm" style="cursor:pointer">${icon('upload', 14)} رفع شعار
              <input type="file" accept="image/*" id="logoInput" hidden></label>
            <button class="btn btn-outline btn-sm" data-action="reset-logo">استعادة الافتراضي</button>
          </div>
        </section>
        <section class="card settings-section">
          <h3>${icon('building', 17)} بطاقة الشركة</h3>
          <div class="company-card">
            <img src="${esc(s.logoLight || s.logo)}" alt="">
            <div class="cc-tag">${esc(s.tagline)}</div>
            <div class="cc-service">${esc(s.serviceName)}</div>
            <div class="cc-line"></div>
            <div class="cc-info num" dir="ltr">${esc(s.phone)}</div>
            <div class="cc-info">${esc(s.email)}</div>
            <div class="cc-info">${esc(s.address)}</div>
          </div>
        </section>
      </aside>
    </form>`;
  };

  /* ---------------- dictation (speech to text) ---------------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recog = null, recogBtn = null;

  function stopDictation() {
    if (recog) { try { recog.stop(); } catch (e) { } }
    recog = null;
    if (recogBtn) { recogBtn.classList.remove('rec'); recogBtn = null; }
  }

  function toggleDictation(input, btn) {
    if (!input) return;
    if (!SR) { toast('المتصفح لا يدعم الكتابة الصوتية — استخدم Chrome أو Safari', 'err'); return; }
    if (recog) { stopDictation(); return; }
    recog = new SR();
    recog.lang = 'ar-SA';
    recog.continuous = true;
    recog.interimResults = false;
    recogBtn = btn; btn.classList.add('rec');
    const base = input.value ? input.value.trim() + ' ' : '';
    let finalText = '';
    recog.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
      }
      input.value = (base + finalText).trim();
    };
    recog.onerror = ev => {
      if (ev.error === 'not-allowed') toast('اسمح للموقع باستخدام المايكروفون', 'err');
      else if (ev.error !== 'aborted' && ev.error !== 'no-speech') toast('تعذر التقاط الصوت', 'err');
      stopDictation();
    };
    recog.onend = () => stopDictation();
    try { recog.start(); toast('تحدث الآن…'); } catch (e) { stopDictation(); }
  }

  /* ---------------- modal / drawer ---------------- */
  function openModal(html, opts = {}) {
    const host = qs('#modalHost');
    host.innerHTML = `<div class="modal ${opts.size === 'sm' ? 'sm' : ''} ${opts.size === 'full' ? 'full' : ''}" role="dialog" aria-modal="true">${html}</div>`;
    host.hidden = false; qs('#overlay').hidden = false;
    ui.modalOpen = true;
    document.body.classList.add('modal-open');
  }
  function closeModal() {
    if (loginOpen) return;
    const host = qs('#modalHost');
    if (!host) return;
    host.hidden = true; host.innerHTML = '';
    ui.modalOpen = false;
    if (!ui.drawerOpen) { qs('#overlay').hidden = true; document.body.classList.remove('modal-open'); }
  }
  function openDrawer(html) {
    const d = qs('#drawer'); d.innerHTML = html; d.hidden = false;
    qs('#overlay').hidden = false; ui.drawerOpen = true;
  }
  function closeDrawer() {
    const d = qs('#drawer');
    if (!d) return;
    d.hidden = true; d.innerHTML = ''; ui.drawerOpen = false;
    if (!ui.modalOpen) { qs('#overlay').hidden = true; document.body.classList.remove('modal-open'); }
  }
  function openLightbox(src, caption) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = `<figure><img src="${src}" alt=""><figcaption>${esc(caption || '')}</figcaption></figure>`;
    box.addEventListener('click', () => box.remove());
    document.body.appendChild(box);
  }

  function exportWord(srcEl, filename) {
    if (!srcEl) { toast('لا يوجد تقرير للتصدير', 'err'); return; }
    const clone = srcEl.cloneNode(true);
    clone.querySelectorAll('.no-print').forEach(n => n.remove());
    const css = `body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;color:#211C19;font-size:11pt;margin:18px}
      h2{font-size:17pt;margin:6px 0}h3{font-size:12pt;margin:10px 0 4px}
      table{border-collapse:collapse;width:100%;margin:6px 0}
      th,td{border:1px solid #bbb;padding:5px 7px;font-size:9.5pt;text-align:right;vertical-align:top}
      th{background:#F3EDE1}
      img{max-width:560px}
      .report-head{display:flex;gap:12px;align-items:center;border-bottom:2px solid #6E1220;padding-bottom:8px;margin-bottom:10px}
      .report-logo{height:60px}
      .report-meta{display:flex;gap:20px;justify-content:space-between}
      .signatures{display:flex;gap:24px;justify-content:space-between;margin-top:18px;border-top:1px solid #ccc;padding-top:8px}
      .signatures div{flex:1;text-align:center}
      .sig-img{height:50px}
      .photo-grid{display:block}
      .photo-grid figure{display:inline-block;width:31%;margin:4px 1%;vertical-align:top;border:1px solid #ccc;padding:4px}
      .photo-grid img{width:100%;height:auto}
      .stamp-card{border:2px solid #8FC3A8;padding:8px;text-align:center;width:240px}
      .chip{border:1px solid #ccc;padding:1px 5px;font-size:8pt}
      .tiny{font-size:8pt;color:#777}
      .big-score{font-size:22pt}
      .report-stamp-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:16px}
      .toasts,.toolbar,.approval-bar{display:none}`;
    const html = `<html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${esc(filename)}</title><style>${css}</style></head><body>${clone.outerHTML}</body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' });
    const a0 = document.createElement('a');
    a0.href = URL.createObjectURL(blob);
    a0.download = filename + '.doc';
    document.body.appendChild(a0); a0.click(); a0.remove();
    setTimeout(() => URL.revokeObjectURL(a0.href), 4000);
    toast('تم تصدير ملف Word');
  }

  function printSheet(which) {
    const hasPhotos = !!qs('#photoReport');
    const cls = (which === 'photos' && hasPhotos) ? 'print-photos' : 'print-written';
    document.body.classList.remove('print-photos', 'print-written');
    document.body.classList.add(cls);
    const done = () => { document.body.classList.remove('print-photos', 'print-written'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(() => window.print(), 60);
  }

  /* ---------- وضع التحديثات ---------- */
  function maintenanceWindow() {
    const m = (S().maintenance || {});
    if (!m.enabled) return null;
    const now = Date.now();
    const start = m.start ? new Date(m.start).getTime() : null;
    const end = m.end ? new Date(m.end).getTime() : null;
    if (start && now < start) return { phase: 'soon', start, end };
    if (end && now >= end) return { phase: 'done', start, end };
    return { phase: 'on', start, end };
  }
  const maintFmt = ts => ts ? new Date(ts).toLocaleString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  function paintMaintenance() {
    const st = maintenanceWindow();
    const overlay = qs('#maintOverlay');
    const banner = qs('#maintBanner');
    const active = st && st.phase === 'on';
    const cu = currentUser();
    const uname = cu ? (cu.username || '') : '';
    const allowList = ((db.settings.maintenance || {}).allow) || ['الموارد البشرية', 'admin'];
    const bypass = isAdmin() || allowList.some(a => String(a).toLowerCase() === String(uname).toLowerCase() || String(a).toLowerCase() === String((cu && cu.role) || '').toLowerCase());
    const loggedIn = !!cu;
    const soonLeft = (st && st.phase === 'soon' && st.start) ? (st.start - Date.now()) : -1;
    const soon = loggedIn && soonLeft > 0;   /* يظهر دائمًا بعد الجدولة، ويصير تحذيريًا آخر 10 دقائق */
    let soonEl = qs('#maintSoon');
    if (!soon) {
      if (soonEl) soonEl.remove();
      document.body.classList.remove('maint-soon-on');
    } else {
      if (!soonEl) {
        soonEl = document.createElement('div');
        soonEl.id = 'maintSoon'; soonEl.className = 'maint-soon no-print';
        soonEl.innerHTML = `${icon('alert', 15)}<span>المنصة ستدخل في الصيانة خلال</span><b id="maintSoonCount">--:--</b><span>— احفظ عملك قبل الإغلاق</span>`;
        document.body.appendChild(soonEl);
        document.body.classList.add('maint-soon-on');
      }
      const rem = Math.max(0, soonLeft);
      const dd = Math.floor(rem / 86400000), hh = Math.floor(rem % 86400000 / 3600000),
        mm = Math.floor(rem % 3600000 / 60000), ss = Math.floor(rem % 60000 / 1000);
      const c = qs('#maintSoonCount');
      if (c) c.textContent = dd > 0 ? (dd + ' يوم ' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'))
        : hh > 0 ? (String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0'))
          : (String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0'));
      if (soonEl) soonEl.classList.toggle('urgent', soonLeft <= 10 * 60 * 1000);
    }
    if (!active || bypass || !loggedIn) {
      if (overlay) overlay.remove();
      document.body.classList.remove('maint-on');
      if (banner) banner.remove();
      if (active && bypass) {
        const b = document.createElement('div');
        b.id = 'maintBanner'; b.className = 'maint-banner no-print';
        b.innerHTML = `${icon('alert', 14)} وضع التحديثات مفعّل — العملاء يرون شاشة الصيانة حتى ${esc(maintFmt(st.end))} · حسابك (${esc(uname)}) مستثنى ويرى الموقع بشكل طبيعي`;
        document.body.appendChild(b);
      }
      return;
    }
    if (!overlay) {
      const el = document.createElement('div');
      el.id = 'maintOverlay'; el.className = 'maint-overlay';
      el.innerHTML = `<div class="maint-card maint-card-img">
        <img class="maint-notice" src="assets/brand/maintenance-notice.png" alt="مركز التحديثات">
        <div class="maint-body">
          <div class="maint-count" id="maintCount"></div>
          <div class="maint-end">العودة المتوقعة: ${esc(maintFmt(st.end))}</div>
        </div>
      </div>`;
      document.body.appendChild(el);
      document.body.classList.add('maint-on');
    }
    const cnt = qs('#maintCount');
    if (cnt) {
      const remain = Math.max(0, (st.end || Date.now()) - Date.now());
      const d = Math.floor(remain / 86400000), h = Math.floor(remain % 86400000 / 3600000),
        m = Math.floor(remain % 3600000 / 60000), sec = Math.floor(remain % 60000 / 1000);
      cnt.innerHTML = `<div class="mc-unit"><b>${d}</b><span>يوم</span></div><div class="mc-sep">:</div><div class="mc-unit"><b>${String(h).padStart(2, '0')}</b><span>ساعة</span></div><div class="mc-sep">:</div><div class="mc-unit"><b>${String(m).padStart(2, '0')}</b><span>دقيقة</span></div><div class="mc-sep">:</div><div class="mc-unit"><b>${String(sec).padStart(2, '0')}</b><span>ثانية</span></div>`;
    }
  }
  let maintTick = null;
  function startMaintenanceWatcher() {
    paintMaintenance();
    if (maintTick) return;
    maintTick = setInterval(() => {
      paintMaintenance();
      const st = maintenanceWindow();
      if (st && st.phase === 'done') {
        const m = S().maintenance || {};
        if (m.enabled) { m.enabled = false; save(); paintMaintenance(); toast('انتهى وقت التحديثات — تم فتح المنصة'); }
      }
    }, 1000);
  }

  /* ---------- إدارة المساحة ---------- */
  function dbSizeKB() { try { return Math.round(JSON.stringify(db).length / 1024); } catch (e) { return 0; } }
  function shrinkDataUrl(src, maxDim, quality) {
    return new Promise(resolve => {
      if (!src || String(src).indexOf('data:image') !== 0) return resolve(null);
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * ratio));
        c.height = Math.max(1, Math.round(img.height * ratio));
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  async function compressPhotos() {
    const slots = [];
    (db.audits || []).forEach(a => {
      Object.keys(a.photos || {}).forEach(k => {
        const arr = a.photos[k];
        if (Array.isArray(arr)) arr.forEach((src, i) => slots.push({ get: () => a.photos[k][i], set: v => { a.photos[k][i] = v; } }));
      });
      (a.extraPhotos || []).forEach(p => slots.push({ get: () => p.src, set: v => { p.src = v; } }));
    });
    if (!slots.length) { toast('لا توجد صور لضغطها', 'err'); return; }
    const before = dbSizeKB();
    let n = 0;
    toast('جارٍ ضغط الصور… قد يأخذ دقيقة');
    for (const it of slots) {
      const src = it.get(); if (!src) continue;
      if (src.length < 30000) continue;
      const out = await shrinkDataUrl(src, 720, 0.4);
      if (out && out.length < src.length * 0.9) { it.set(out); n++; }
    }
    save();
    const after = dbSizeKB();
    toast(n ? 'تم ضغط ' + n + ' صورة — وفّرت ' + Math.max(0, before - after) + ' كيلوبايت' : 'الصور مضغوطة مسبقًا');
  }

  function toast(msg, kind = 'ok') {
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.innerHTML = `<span class="ic">${icon(kind === 'err' ? 'alert' : 'check', 18)}</span><span>${esc(msg)}</span>`;
    qs('#toasts').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.25s'; }, 3000);
    setTimeout(() => t.remove(), 3300);
  }


  /* ---------------- stamp + QR ---------------- */
  function qrSvg(text) {
    try {
      const q = qrcode(0, 'M'); q.addData(text); q.make();
      return q.createSvgTag({ cellSize: 3, margin: 0, scalable: true });
    } catch (e) { return ''; }
  }
  function stampHTML(opts) {
    const approved = !!opts.approved;
    return `<div class="stamp-card ${approved ? '' : 'pending'}">
      <div class="stamp-top">شركة سنام الرائدة</div>
      <img class="stamp-logo" src="assets/brand/snam-logo-maroon.png" alt="">
      <div class="stamp-company">المشغّلة لمطاعم حاشي باشا</div>
      <div class="stamp-no">${esc(opts.no || '')}</div>
      <div class="stamp-sep"></div>
      <div class="stamp-mgr">${esc((opts.regionName && opts.regionName.indexOf('المنطقة') === 0) ? opts.regionName : 'المنطقة ' + (opts.regionName || 'الجنوبية'))}</div>
      <div class="stamp-sup">${approved ? 'معتمد' : 'بانتظار الاعتماد'} · ${fmtDate(opts.date)}</div>
    </div>`;
  }

  /* ---------------- branch / city modals ---------------- */
  function openCityModal(regionId, cityId) {
    const c = cityId ? cityById(cityId) : null;
    openModal(`<div class="modal-head"><div><h2>${c ? 'تعديل مدينة' : 'إضافة مدينة'}</h2><p>${esc(regionById(c ? c.regionId : regionId).name)}</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field full"><label>اسم المدينة</label><input class="input" id="cityName" value="${c ? esc(c.name) : ''}" placeholder="مثال: الخرج"></div>
        <div class="field full"><label>المنطقة</label><select class="select" id="cityRegion">
          ${db.regions.map(r => `<option value="${r.id}" ${r.id === (c ? c.regionId : regionId) ? 'selected' : ''}>${r.name}</option>`).join('')}</select></div>
        <div class="field full"><label class="row" style="gap:8px"><input type="checkbox" id="cityActive" ${!c || c.active !== false ? 'checked' : ''}> المدينة مفعّلة</label></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-city" data-id="${c ? c.id : ''}">${icon('check', 15)} ${c ? 'حفظ' : 'إضافة'}</button></div>`, { size: 'sm' });
  }

  function openBranchModal(cityId, branchId) {
    const b = branchId ? branchById(branchId) : null;
    const nextCode = 'SN-' + String(db.branches.reduce((m, x) => Math.max(m, Number(x.code.replace(/\D/g, ''))), 0) + 1).padStart(3, '0');
    openModal(`<div class="modal-head"><div><h2>${b ? 'تعديل فرع' : 'إضافة فرع'}</h2><p>${esc(cityById(cityId).name)}</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>اسم الفرع</label><input class="input" id="brName" value="${b ? esc(b.name) : ''}" placeholder="فرع ..."></div>
        <div class="field"><label>كود الفرع</label><input class="input num" id="brCode" value="${b ? b.code : nextCode}"></div>
        <div class="field"><label>المدينة</label><select class="select" id="brCity">
          ${db.regions.map(r => `<optgroup label="${r.name}">${db.cities.filter(c => c.regionId === r.id).map(c => `<option value="${c.id}" ${c.id === cityId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</optgroup>`).join('')}
        </select></div>
        <div class="field"><label>مدير الفرع</label><input class="input" id="brManager" value="${b ? esc(b.manager) : ''}"></div>
        <div class="field"><label>الهاتف</label><input class="input num" id="brPhone" dir="ltr" value="${b ? esc(b.phone) : ''}"></div>
        <div class="field"><label>عدد المقاعد</label><input class="input num" id="brSeats" type="number" value="${b ? b.seats : ''}"></div>
        <div class="field full"><label>العنوان</label><input class="input" id="brAddress" value="${b ? esc(b.address || '') : ''}"></div>
        <div class="field"><label>تاريخ الافتتاح</label><input class="input num" type="date" id="brOpened" value="${b ? b.opened : '2026-01-01'}"></div>
        <div class="field full"><label>الموقع الجغرافي</label>
          <div class="row" style="gap:8px;align-items:center">
            <input class="input" id="brMap" placeholder="الصق رابط الموقع من خرائط جوجل" value="${esc((b && b.mapUrl) || '')}">
            <button type="button" class="btn btn-outline" data-action="geo-branch" style="white-space:nowrap">${icon('pin', 15)} موقعي الحالي</button>
          </div>
          <div class="tiny muted" id="geoInfo" style="margin-top:6px">${b && b.lat ? 'الإحداثيات: ' + b.lat + ', ' + b.lng : 'اضغط «موقعي الحالي» وأنت داخل الفرع — يُحفظ الموقع بدون عرض خريطة.'}</div>
          <input type="hidden" id="brLat" value="${b && b.lat ? b.lat : ''}"><input type="hidden" id="brLng" value="${b && b.lng ? b.lng : ''}">
        </div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="save-branch" data-id="${b ? b.id : ''}">${icon('check', 15)} حفظ</button></div>`);
  }

  function saveCity(id) {
    const name = qs('#cityName').value.trim();
    const rid = qs('#cityRegion').value;
    const active = qs('#cityActive') ? qs('#cityActive').checked : true;
    if (!name) { toast('أدخل اسم المدينة', 'err'); return; }
    if (id) {
      const c = db.cities.find(x => x.id === id); if (!c) return;
      Object.assign(c, { name, regionId: rid, active });
      save(); closeModal(); render(); toast('تم تعديل المدينة ' + name);
    } else {
      db.cities.push({ id: 'ct-' + Date.now(), name, regionId: rid, active });
      save(); closeModal(); render(); toast('تمت إضافة المدينة ' + name);
    }
  }

  function saveBranch(id) {
    const name = qs('#brName').value.trim();
    const cid = qs('#brCity').value;
    if (!name) { toast('أدخل اسم الفرع', 'err'); return; }
    const city = cityById(cid);
    const data = {
      name, code: qs('#brCode').value.trim() || 'SN-000', cityId: cid, regionId: city.regionId,
      manager: qs('#brManager').value.trim(), phone: qs('#brPhone').value.trim(),
      seats: Number(qs('#brSeats').value) || 0, address: qs('#brAddress').value.trim(),
      opened: qs('#brOpened').value || '2026-01-01',
      mapUrl: (qs('#brMap').value || '').trim(),
      lat: qs('#brLat').value || '', lng: qs('#brLng').value || ''
    };
    if (id) {
      db.branches = db.branches.map(x => x.id === id ? { ...x, ...data } : x);
      toast('تم تحديث الفرع');
    } else {
      db.branches.push({ id: 'b' + Date.now(), ...data });
      toast('تمت إضافة الفرع ' + name);
    }
    save(); closeModal(); render();
  }

  /* ---------------- wizard ---------------- */
  let wiz = null;
  const DRAFT_KEY = 'snam_draft_v3';
  const sectionsActive = () => SEC().filter(s => s.active !== false).sort((a, b) => a.order - b.order);
  const stepsCount = () => sectionsActive().length + 2;

  function localDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch (e) { return null; }
  }
  function cloudDraft() {
    try { return (db.drafts && session && db.drafts[session]) || null; } catch (e) { return null; }
  }
  function draftInfo() {
    const d = localDraft() || cloudDraft();
    if (!d || !d.branchId) return null;
    return { branchId: d.branchId, step: d.step || 0, id: d.id || null, at: d.savedAt || null };
  }
  function draftBanner() {
    const d = draftInfo();
    if (!d) return '';
    const b = branchById(d.branchId);
    const when = d.at ? new Date(d.at) : null;
    const t = when ? when.toLocaleString('ar-SA', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';
    return `<div class="card no-print" style="margin-bottom:14px;border-color:#D8C39A;background:#FBF5E7">
      <div class="card-body row" style="gap:12px;align-items:center;flex-wrap:wrap">
        ${icon('pause', 20)}
        <div style="flex:1;min-width:180px">
          <div style="font-size:13px;font-weight:600">زيارة محفوظة — لم تكتمل</div>
          <div class="tiny muted">${esc(b.name)} · الخطوة ${Number(d.step) + 1}${t ? ' · ' + esc(t) : ''}</div>
        </div>
        <button class="btn btn-primary btn-sm" data-action="resume-draft">${icon('play', 15)} استئناف من حيث توقفت</button>
        <button class="btn btn-outline btn-sm" data-action="discard-draft">${icon('trash', 15)} حذف</button>
      </div></div>`;
  }

  function saveDraftNow(reason) {
    if (!wiz) return;
    captureWizard();
    try {
      wiz.savedAt = new Date().toISOString();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(wiz));
      if (session) { db.drafts = db.drafts || {}; db.drafts[session] = wiz; }
      save();
    } catch (e) { }
    if (reason) toast(reason);
  }
  function resumeDraft() {
    let d = localDraft() || cloudDraft();
    if (!d) { toast('لا توجد زيارة محفوظة', 'err'); return; }
    wiz = d;
    if (!wiz.items) wiz.items = {};
    if (!wiz.itemNotes) wiz.itemNotes = {};
    if (!wiz.photos) wiz.photos = {};
    if (!Array.isArray(wiz.extraPhotos)) wiz.extraPhotos = [];
    if (typeof wiz.step !== 'number' || wiz.step >= stepsCount()) wiz.step = 0;
    openModal(`<div class="modal-head">
        <div><h2>استئناف الزيارة${wiz.id ? ' ' + wiz.id : ''}</h2>
          <p>${esc(branchLabel(branchById(wiz.branchId)))} · ${wiz.savedAt ? fmtDate(wiz.savedAt.slice(0, 10)) : ''}</p></div>
        <button class="close-x" data-action="close-wizard">${icon('x', 16)}</button></div>
      <div class="wiz-progress" id="wizProgress"></div>
      <div class="modal-body" id="wizBody"></div>
      <div class="modal-foot" id="wizFoot"></div>`, { size: 'full' });
    renderWizardStep();
  }

  function askInput(title, def, onOk) {
    openModal(`<div class="modal-head"><h3>${esc(title)}</h3></div>
      <div class="modal-body"><input class="input" id="askInputField" value="${esc(def || '')}"></div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" id="askInputOk">${icon('check', 15)} حفظ</button></div>`, { size: 'sm' });
    const f = qs('#askInputField'); if (f) { f.focus(); f.select(); }
    const ok = () => { const v = (qs('#askInputField') || {}).value || ''; closeModal(); if (v.trim()) onOk(v.trim()); };
    const b = qs('#askInputOk'); if (b) b.onclick = ok;
    if (f) f.onkeydown = e => { if (e.key === 'Enter') ok(); };
  }

  function askConfirm(msg, onYes) {
    openModal(`<div class="modal-head"><h3>${icon('alert', 18)} تأكيد</h3></div>
      <div class="modal-body"><p style="font-size:13.5px;line-height:1.8">${esc(msg)}</p></div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-danger" id="cfmYes">${icon('trash', 15)} تأكيد الحذف</button></div>`, { size: 'sm' });
    const b = qs('#cfmYes'); if (b) b.onclick = () => { closeModal(); onYes(); };
  }

  const canCreateInv = () => { const u = currentUser(); if (!u) return false; return ['admin', 'quality_manager', 'ops_manager'].includes(u.role) && (!scopeRegion() || u.role === 'admin' || u.regionId === scopeRegion() || u.regionId === 'all'); };
  const editSet = () => (ui.route === 'form-inv' ? (db.invSections || []) : ui.editBm ? (db.bmSections || []) : db.sections);
  const canEditForms = () => { const u = currentUser(); return !!u && ['admin', 'quality_manager', 'ops_manager'].includes(u.role); };
  const setItemMax = () => (ui.editBm ? 5 : 4);

  function newWizard(branchId, auditId, forceType) {
    const a = auditId ? db.audits.find(x => x.id === auditId) : null;
    wiz = a ? {
      id: a.id, branchId: a.branchId, type: a.type, surprise: !!a.surprise, date: a.date, auditor: a.auditor,
      regionId: branchById(a.branchId).regionId, cityId: branchById(a.branchId).cityId,
      items: { ...a.items }, notes: a.notes || '', recommendations: a.recommendations || '',
      photos: { ...(a.photos || {}) }, itemNotes: { ...(a.itemNotes || {}) }, step: 0,
      extraPhotos: (a.extraPhotos || []).map(x => ({ ...x })),
      visitTime: a.visitTime || '',
      createdBy: a.createdBy || '', createdAt: a.createdAt || a.date
    } : {
      id: null,
      regionId: scopeRegion() || 'r-south',
      cityId: defaultCityFor(scopeRegion() || 'r-south'),
      branchId: (db.branches.find(b => b.cityId === defaultCityFor(scopeRegion() || 'r-south')) || {}).id || branchId || (db.branches[0] || {}).id,
      type: forceType || 'monthly', surprise: false, date: '2026-11-06',
      auditor: '', items: {}, notes: '', recommendations: '', photos: {}, itemNotes: {}, step: 0, extraPhotos: []
    };
    sectionsActive().forEach(s => scoredItems(s).forEach(it => { if (wiz.items[it.id] == null) wiz.items[it.id] = (Number(it.max) || 4); }));
    openModal(`<div class="modal-head">
        <div><h2>${isBmType(wiz.type) ? (wiz.id ? 'تعديل تقييم مدير فرع — ' + wiz.id : 'تقييم مدير فرع جديد') : (wiz.id ? 'تعديل زيارة ' + wiz.id : 'زيارة رقابية جديدة')}</h2>
          <p id="wizBranchLabel">${esc(branchLabel(branchById(wiz.branchId)))}</p></div>
        <button class="close-x" data-action="close-wizard">${icon('x', 16)}</button></div>
      <div class="wiz-progress" id="wizProgress"></div>
      <div class="modal-body" id="wizBody"></div>
      <div class="modal-foot" id="wizFoot"></div>`, { size: 'full' });
    renderWizardStep();
  }

  function renderWizardStep() {
    const secs = sectionsActive();
    const total = stepsCount();
    const step = wiz.step;

    qs('#wizProgress').innerHTML = `<div class="wiz-steps">${Array.from({ length: total }).map((_, i) => {
      const label = i === 0 ? 'البيانات' : i === total - 1 ? 'التقييم' : (secs[i - 1] ? secs[i - 1].name : '');
      return `<div class="wiz-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}" data-action="wiz-step" data-step="${i}">
        <i>${i < step ? '✓' : i + 1}</i><span>${esc(label)}</span></div>`;
    }).join('')}</div><div class="wiz-bar"><i style="width:${(step / (total - 1)) * 100}%"></i></div>`;

    if (step === 0) {
      qs('#wizBody').innerHTML = `<div class="form-grid" style="max-width:720px">
        <div class="field"><label>المنطقة</label><select class="select" id="wRegion">
          ${db.regions.filter(r => !scopeRegion() || r.id === scopeRegion()).map(r => `<option value="${r.id}" ${r.id === wiz.regionId ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select></div>
        <div class="field"><label>المدينة</label><select class="select" id="wCity">
          ${db.cities.filter(c => c.regionId === wiz.regionId).map(c => `<option value="${c.id}" ${c.id === wiz.cityId ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
        <div class="field"><label>الفرع</label><select class="select" id="wBranch">
          ${db.branches.filter(b => b.cityId === wiz.cityId).map(b => `<option value="${b.id}" ${b.id === wiz.branchId ? 'selected' : ''}>${esc(b.name)} (${b.code})</option>`).join('')}</select></div>
        <div class="field"><label>نوع الزيارة</label><select class="select" id="wType">
          ${isBmType(wiz.type)
            ? BM_TYPES.map(t => `<option value="${t}" ${t === wiz.type ? 'selected' : ''}>زيارة مدير الفرع — ${typeName(t)}</option>`).join('')
            : TYPE_ORDER.map(t => `<option value="${t}" ${t === wiz.type ? 'selected' : ''}>${typeName(t)}</option>`).join('')}
        </select></div>
        <div class="field"><label>التاريخ</label><input class="input num" type="date" id="wDate" value="${wiz.date}" max="2026-11-06"></div>
        <div class="field full"><label class="row" style="gap:8px"><input type="checkbox" id="wSurprise" ${wiz.surprise ? 'checked' : ''}> زيارة مفاجأة (بدون إشعار مسبق)</label></div>
        <div class="field"><label>المدقق</label><input class="input" id="wAuditor" autocomplete="off" placeholder="اكتب اسم المدقق يدويًا" value="${esc(wiz.auditor || '')}"></div>
      </div>
      <div class="note" style="margin-top:16px;max-width:720px">${icon('target', 16)}
        <span>الدرجة النهائية من ${maxPoints()}. درجة كل محور من مجموع بنوده، وكل بند يقيّم من ٥.</span></div>`;
    } else if (step === total - 1) {
      const rec = scoreOfItems(wiz.items);
      const lows = [];
      secs.forEach(s => activeItems(s).forEach(it => { if ((wiz.items[it.id] ?? (Number(it.max) || 4)) <= 2) lows.push(it.text); }));
      qs('#wizBody').innerHTML = `
        <div class="final-grid">
          <div>
            <div class="field" style="margin-bottom:14px"><label>ملاحظات عامة</label>
              <div class="ta-wrap"><textarea class="textarea" id="wNotes" placeholder="انطباع عام عن الزيارة… أو تحدّث">${esc(wiz.notes)}</textarea>
              <button type="button" class="mic-btn floating" data-action="dictate" data-target="#wNotes">${icon('mic', 15)}</button></div></div>
            <div class="field"><label>التوصيات وخطة التحسين</label>
              <div class="ta-wrap"><textarea class="textarea" id="wRecs" placeholder="الإجراءات المتفق عليها… أو تحدّث">${esc(wiz.recommendations)}</textarea>
              <button type="button" class="mic-btn floating" data-action="dictate" data-target="#wRecs">${icon('mic', 15)}</button></div></div>
            ${lows.length ? `<div class="note" style="margin-top:14px">${icon('alert', 16)}<span>${lows.length} بندًا يحتاج تصحيحًا — ستُنشأ ملاحظات تلقائيًا.</span></div>` : ''}
          </div>
          <div class="score-panel">
            <div class="lbl">الدرجة النهائية</div>
            <div class="score-ring">${ring(rec.overall, 132)}<div class="val">${rec.points}<small>/${maxPoints()}</small></div></div>
            <div class="chip ${rec.overall >= S().passScore ? 'chip-ok' : rec.overall >= S().warnScore ? 'chip-warn' : 'chip-bad'}" style="margin:0 auto">${rec.overall >= S().passScore ? 'اجتياز' : rec.overall >= S().warnScore ? 'تحت المتابعة' : 'غير مطابق'}</div>
            <div class="est"><span>النسبة</span><b>${rec.overall}%</b></div>
            <div class="est"><span>الدرجة الخام</span><b>${pair(rec.got, rec.max)}</b></div>
          </div>
        </div>`;
    } else {
      const sec = secs[step - 1];
      qs('#wizBody').innerHTML = `
        <div class="wiz-sec-head">
          <div><h3>${esc(sec.name)}</h3><p class="small muted">${activeItems(sec).length} بندًا — قيّم كل بند من ${(activeItems(sec)[0] || {}).max || 4}</p></div>
          <div class="spacer"></div>
          <span class="chip chip-gold" id="secScoreChip">${sectionScore(sec, wiz.items).pct}%</span>
        </div>
        <div class="wiz-items">
          ${activeItems(sec).filter(it => !isPhotoItem(it)).map((it, i) => {
            const v = wiz.items[it.id] ?? (Number(it.max) || 4);
            const photo = wiz.photos[it.id];
            return `<div class="wiz-item" data-item-row="${it.id}">
              <div class="wi-index">${i + 1}</div>
              <div class="wi-text">${esc(it.text)}
                <div class="wi-note-row">
                  <input class="wi-note" data-note="${it.id}" placeholder="اكتب ملاحظة على البند… أو اضغط المايك للتحدث" value="${esc(wiz.itemNotes[it.id] || '')}">
                  <button type="button" class="mic-btn" data-action="dictate" data-target='[data-note="${it.id}"]' title="كتابة صوتية">${icon('mic', 14)}</button>
                </div>
                ${photoList(wiz, it.id).length ? `<div class="item-photos">${photoList(wiz, it.id).map((src, pi) => `<span class="ip"><img src="${src}" alt=""><button type="button" class="ip-x" data-action="del-item-photo" data-item="${it.id}" data-idx="${pi}" title="حذف">${icon('x', 10)}</button></span>`).join('')}</div>` : ''}
              </div>
              <div class="wi-actions">
                <div class="rate">
                  ${Array.from({ length: (Number(it.max) || 4) + 1 }, (_, n) => n).map(n => `<label><input type="radio" name="it_${it.id}" value="${n}" ${v === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}
                </div>
                <label class="photo-btn ${photoList(wiz, it.id).length ? 'has' : ''}" title="إضافة صور — حتى 5">
                  ${photoList(wiz, it.id).length ? `<img src="${photoList(wiz, it.id)[0]}" alt=""><span class="photo-count">${photoList(wiz, it.id).length}/5</span>` : icon('camera', 16)}
                  <input type="file" accept="image/*" multiple data-photo="${it.id}" hidden>
                </label>
              </div>
            </div>`;
          }).join('')}
          ${(activeItems(sec).filter(isPhotoItem)).map(it => `
            <div class="wiz-item photo-extra" data-item-row="${it.id}">
              <div class="wi-index">${icon('camera', 15)}</div>
              <div class="wi-text">
                <b>${esc(it.text)}</b>
                <p class="small muted" style="margin:2px 0 8px">أضف أي عدد من الصور، واكتب شرحًا تحت كل صورة. هذا البند لا يُحتسب ضمن الدرجة.</p>
                <div class="extra-photos">
                  ${(wiz.extraPhotos || []).map((ph, pi) => `<div class="xp-card">
                    <span class="xp-no">${pi + 1}</span>
                    <img src="${ph.src}" alt="">
                    <input class="wi-note" data-cap="${ph.id}" placeholder="شرح الصورة…" value="${esc(ph.caption || '')}">
                    <button type="button" class="photo-del" data-action="del-extra-photo" data-xphoto="${ph.id}" title="حذف">${icon('x', 12)}</button>
                  </div>`).join('')}
                  <label class="xp-add" title="إضافة صور">
                    ${icon('plus', 18)}<span>إضافة صور</span>
                    <input type="file" accept="image/*" multiple data-extra-photo="1" hidden>
                  </label>
                </div>
              </div>
            </div>`).join('')}
        </div>`;
    }

    qs('#wizFoot').innerHTML = `
      <button class="btn btn-outline" data-action="wiz-prev" ${step === 0 ? 'disabled' : ''}>السابق</button>
      <button class="btn btn-outline" data-action="wiz-save">${icon('check', 15)} حفظ ومتابعة</button>
      <button class="btn btn-outline" data-action="pause-visit" title="إيقاف مؤقت — تحفظ الزيارة وتكملها لاحقًا">${icon('pause', 15)} إيقاف مؤقت</button>
      <div class="spacer"></div>
      <span class="tiny muted">${step + 1} / ${total}</span>
      ${step === total - 1
        ? `<button class="btn btn-primary" data-action="wiz-finish">${icon('check', 15)} حفظ التقرير النهائي</button>`
        : `<button class="btn btn-primary" data-action="wiz-next">التالي ${icon('arrowLeft', 15)}</button>`}`;
  }

  function captureWizard() {
    if (!wiz) return;
    if (wiz.step === 0) {
      const rg = qs('#wRegion'); if (rg) wiz.regionId = rg.value;
      const ct = qs('#wCity'); if (ct) wiz.cityId = ct.value;
      const b = qs('#wBranch'); if (b) wiz.branchId = b.value;
      const t = qs('#wType'); if (t) wiz.type = t.value;
      const d = qs('#wDate'); if (d) wiz.date = d.value || '2026-11-06';
      const au = qs('#wAuditor'); if (au) wiz.auditor = au.value;
      const sp = qs('#wSurprise'); if (sp) wiz.surprise = sp.checked;
      sectionsActive().forEach(sc => scoredItems(sc).forEach(it => { if (wiz.items[it.id] == null) wiz.items[it.id] = (Number(it.max) || 4); }));
    } else {
      const secs = sectionsActive();
      const sec = secs[wiz.step - 1];
      if (sec) {
        activeItems(sec).forEach(it => {
          const el = qs(`input[name="it_${it.id}"]:checked`);
          if (el) wiz.items[it.id] = Number(el.value);
          const nt = qs(`[data-note="${it.id}"]`);
          if (nt) wiz.itemNotes[it.id] = nt.value;
        });
        qsa('[data-cap]').forEach(inp => {
          const ph = (wiz.extraPhotos || []).find(x => x.id === inp.dataset.cap);
          if (ph) ph.caption = inp.value;
        });
      } else {
        const n = qs('#wNotes'), r = qs('#wRecs');
        if (n) wiz.notes = n.value;
        if (r) wiz.recommendations = r.value;
      }
    }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(wiz)); } catch (e) { }
  }

  function finishWizard() {
    captureWizard();
    if (!wiz.branchId) { toast('اختر المدينة والفرع أولًا', 'err'); return; }
    const rec = scoreOfItems(wiz.items);
    const id = wiz.id || 'AU-' + String(db.audits.reduce((m, a) => Math.max(m, Number(a.id.replace(/\D/g, ''))), 0) + 1).padStart(4, '0');

    db.findings = db.findings.filter(f => f.auditId !== id);
    const audit = {
      id, branchId: wiz.branchId, type: wiz.type, surprise: !!wiz.surprise, date: wiz.date, auditor: wiz.auditor,
      items: { ...wiz.items }, got: rec.got, max: rec.max, overall: rec.overall,
      status: rec.overall >= S().passScore ? 'مكتملة' : 'متابعة مطلوبة',
      notes: wiz.notes, recommendations: wiz.recommendations,
      photos: { ...wiz.photos }, itemNotes: { ...wiz.itemNotes },
      extraPhotos: (wiz.extraPhotos || []).map(x => ({ ...x })),
      kind: isBmType(wiz.type) ? 'bm' : '',
      createdBy: wiz.createdBy || ((currentUser() || {}).username || ''),
      visitTime: wiz.visitTime || clockNow(),
      createdAt: wiz.createdAt || TODAY_ISO(),
      updatedAt: new Date().toISOString()
    };
    if (wiz.id) db.audits = db.audits.map(a => a.id === id ? audit : a);
    else db.audits.unshift(audit);

    let created = 0;
    SEC().forEach(s => scoredItems(s).forEach(it => {
      const v = wiz.items[it.id];
      if (v == null || v >= 3) return;
      const sev = v === 0 ? 'حرج' : v === 1 ? 'عالي' : 'متوسط';
      db.findings.unshift({
        id: 'F-' + String(db.findings.length + 1).padStart(4, '0'),
        auditId: id, branchId: wiz.branchId, sectionId: s.id, sectionName: s.name, itemId: it.id,
        title: it.text, severity: sev, status: 'مفتوح', owner: branchById(wiz.branchId).manager,
        due: addDaysISO(wiz.date, sev === 'حرج' ? 3 : sev === 'عالي' ? 7 : 14),
        action: '', createdAt: wiz.date, closedAt: ''
      });
      created++;
    }));

    save();
    localStorage.removeItem(DRAFT_KEY);
    if (session && db.drafts) delete db.drafts[session];
    ui.filters.auditId = id;
    ui.route = 'audit';
    wiz = null;
    closeModal();
    toast(`تم حفظ التقرير ${id} — ${rec.points} من ${maxPoints()}` + (created ? ` · ${created} ملاحظة` : ''));
    render();
  }

  function handlePhoto(input) {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const itemId = input.dataset.photo;
    const isExtra = input.dataset.extraPhoto != null;
    captureWizard();
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const max = 780;
          let w = img.width, h = img.height;
          const ratio = Math.min(1, max / Math.max(w, h));
          w = Math.round(w * ratio); h = Math.round(h * ratio);
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          const src = c.toDataURL('image/jpeg', 0.45);
          if (isExtra) {
            wiz.extraPhotos = wiz.extraPhotos || [];
            wiz.extraPhotos.push({ id: 'xp' + Date.now() + Math.random().toString(36).slice(2, 5), src, caption: '' });
          } else {
            const arr = Array.isArray(wiz.photos[itemId]) ? wiz.photos[itemId] : (wiz.photos[itemId] ? [wiz.photos[itemId]] : []);
            if (arr.length < 5) arr.push(src);
            wiz.photos[itemId] = arr.slice(0, 5);
          }
          renderWizardStep();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------------- drawers ---------------- */
  function openAudit(id) {
    const a = db.audits.find(x => x.id === id);
    if (!a) return;
    const b = branchById(a.branchId);
    const fs = db.findings.filter(f => f.auditId === a.id);
    const secs = db.sections.filter(s => s.active !== false);
    openDrawer(`
      <div class="drawer-head"><div>
        <div class="tiny muted num">${a.id} · ${typeLabel(a)}</div>
        <h2 style="font-size:17px;font-weight:600;margin-top:2px">${esc(b.name)}</h2>
        <div class="small muted">${fmtDate(a.date)} · ${esc(a.auditor)}</div></div>
        <button class="close-x" data-action="close-drawer">${icon('x', 16)}</button></div>
      <div class="drawer-body">
        <div class="drawer-score">
          <div style="position:relative;width:92px;height:92px;flex:0 0 92px">
            ${ring(a.overall, 92)}<div class="ring-val">${a.overall}%</div></div>
          <div><div class="tiny muted">الدرجة النهائية</div>
            <div class="strong num" style="font-size:22px">${pair(pointsOf(a.overall), TOTAL_POINTS)}</div>
            <span class="chip ${a.overall >= 85 ? 'chip-ok' : a.overall >= 70 ? 'chip-warn' : 'chip-bad'}">${a.status}</span></div>
        </div>
        <h3 class="section-title" style="font-size:13px;margin:16px 0 8px">نتيجة المحاور</h3>
        ${barList(secs.map(s => ({ label: s.name, value: sectionScore(s, a.items).pct })))}
        <h3 class="section-title" style="font-size:13px;margin:18px 0 8px">الملاحظات (${fs.length})</h3>
        ${fs.length ? fs.map(f => `<div class="stat-line" style="align-items:flex-start;gap:8px">
          <div style="flex:1"><div style="font-size:12.5px">${esc(f.title)}</div><div class="tiny muted">${f.severity} · ${f.status}</div></div>
          <span class="chip ${f.status === 'مغلق' ? 'chip-ok' : f.status === 'قيد المعالجة' ? 'chip-info' : 'chip-warn'}">${f.status}</span></div>`).join('') : '<p class="small muted">لا ملاحظات.</p>'}
      </div>
      <div class="drawer-foot">
        <button class="btn btn-outline" data-action="open-branch" data-id="${b.id}">ملف الفرع</button>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-action="view-audit" data-id="${a.id}">عرض التقرير</button>
      </div>`);
  }

  function openBranchMetric(kind) {
    const yr = S().year;
    const rows = scopeBranches().map(b => {
      const l = auditsOf(b.id, null, yr);
      const last = l.slice().sort((x, y) => y.date.localeCompare(x.date))[0];
      return { b, visits: l.length, score: l.length ? avgScore(l) : null, last };
    });
    let list = [], title = '', sub = '';
    if (kind === 'visited') { list = rows.filter(r => r.visits > 0).sort((a, b) => b.visits - a.visits); title = 'فروع تمت زيارتها'; sub = 'مرتبة حسب عدد الزيارات'; }
    else if (kind === 'notvisited') { list = rows.filter(r => r.visits === 0); title = 'فروع لم يتم زيارتها'; sub = 'لم تُسجل فيها أي زيارة هذا العام'; }
    else if (kind === 'top') { list = rows.filter(r => r.visits > 0 && r.score >= S().passScore).sort((a, b) => b.score - a.score); title = 'الفروع المتميزة'; sub = 'متوسط ' + S().passScore + '% وأعلى'; }
    else { list = rows.filter(r => r.visits > 0 && r.score < S().warnScore).sort((a, b) => a.score - b.score); title = 'فروع تحتاج المتابعة المكثفة'; sub = 'أقل الفروع في متوسط درجات الزيارات'; }

    openModal(`<div class="modal-head"><div><h2>${title}</h2><p>${sub} — ${list.length} فرع</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body">
        ${list.length ? `<div class="table-wrap"><table class="tbl">
          <thead><tr><th>الفرع</th><th>المدينة</th><th>الزيارات</th><th>المتوسط</th><th>آخر زيارة</th><th></th></tr></thead>
          <tbody>${list.map(r => `<tr>
            <td><div class="strong">${esc(r.b.name)}</div><div class="tiny muted">${esc(r.b.code)}</div></td>
            <td class="muted">${esc(cityById(r.b.cityId).name)}</td>
            <td class="num">${r.visits}</td>
            <td class="num">${r.score == null ? '—' : r.score + '%'}</td>
            <td class="num">${r.last ? fmtDate(r.last.date) : '—'}</td>
            <td><button class="btn btn-outline btn-sm" data-action="open-branch" data-id="${r.b.id}">${icon('store', 13)}</button></td>
          </tr>`).join('')}</tbody></table></div>`
        : '<p class="small muted">لا توجد فروع في هذه الفئة.</p>'}
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-primary" data-action="close-modal">إغلاق</button></div>`, { size: 'lg' });
  }

  function openBranch(id) {
    const b = branchById(id);
    const list = auditsOf(id, null, S().year).sort((x, y) => y.date.localeCompare(x.date));
    const score = avgScore(list);
    const open = findingsOf(id).filter(f => f.status !== 'مغلق');
    const cov = COVERAGE_ORDER.map(t => ({ t, ...coverageFor(id, t, S().year) }));
    openDrawer(`
      <div class="drawer-head"><div>
        <div class="tiny muted">${b.code} · ${esc(regionById(b.regionId).name)}</div>
        <h2 style="font-size:17px;font-weight:600;margin-top:2px">${esc(cityById(b.cityId).name)} — ${esc(b.name)}</h2>
        <div class="small muted">${esc(b.manager)} · ${esc(b.phone)}</div></div>
        <button class="close-x" data-action="close-drawer">${icon('x', 16)}</button></div>
      <div class="drawer-body">
        <div class="kpis" style="grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div class="kpi" style="padding:12px 14px"><div class="kpi-label">الامتثال</div><div class="kpi-value" style="font-size:24px" dir="ltr">${pointsOf(score)}<small>/${TOTAL_POINTS}</small></div></div>
          <div class="kpi" style="padding:12px 14px"><div class="kpi-label">ملاحظات مفتوحة</div><div class="kpi-value" style="font-size:24px">${open.length}</div></div>
        </div>
        <h3 class="section-title" style="font-size:13px;margin-bottom:10px">تغطية الزيارات</h3>
        ${cov.map(c => `<div class="bar-item" style="margin-bottom:10px">
          <span class="label">${typeName(c.t)}</span><span class="val num">${c.executed}/${c.expected}</span>
          <div class="bar-track"><i class="${c.pct >= 85 ? 'good' : c.pct >= 60 ? 'warn' : 'low'}" style="width:${c.pct}%"></i></div>
        </div>`).join('')}
        <h3 class="section-title" style="font-size:13px;margin:18px 0 8px">آخر الزيارات</h3>
        ${list.slice(0, 5).map(a => `<div class="stat-line">
          <div><div style="font-size:12.5px">${typeLabel(a)} · ${fmtDate(a.date)}</div><div class="tiny muted">${a.id} · ${esc(a.auditor)}</div></div>
          <span class="score ${scoreClass(a.overall)}"><i class="dot"></i>${a.overall}%</span></div>`).join('') || '<p class="small muted">لا زيارات.</p>'}
        <div class="note" style="margin-top:16px">${icon('pin', 15)}<span>${esc(b.address || '')}<br>${esc(b.phone)}</span></div>
      </div>
      <div class="drawer-foot">
        ${isAdmin() ? `<button class="btn btn-outline" data-action="edit-branch" data-id="${b.id}">تعديل</button>
        <button class="btn btn-danger" data-action="delete-branch" data-id="${b.id}">حذف</button>` : ''}
        <div class="spacer"></div>
        <button class="btn btn-primary" data-action="open-annual" data-id="${b.id}">${icon('file', 15)} التقرير السنوي</button>
      </div>`);
  }

  function openFinding(id) {
    const f = db.findings.find(x => x.id === id);
    if (!f) return;
    const b = branchById(f.branchId);
    const a = db.audits.find(x => x.id === f.auditId);
    openDrawer(`
      <div class="drawer-head"><div>
        <div class="tiny muted num">${f.id} · ${esc(f.sectionName)}</div>
        <h2 style="font-size:16px;font-weight:600;margin-top:3px;line-height:1.5">${esc(f.title)}</h2>
        <div class="small muted">${esc(b.name)} · ${f.status}</div></div>
        <button class="close-x" data-action="close-drawer">${icon('x', 16)}</button></div>
      <div class="drawer-body">
        <div class="row" style="gap:8px;margin-bottom:16px">
          <span class="chip ${f.severity === 'حرج' ? 'chip-bad' : f.severity === 'عالي' ? 'chip-warn' : 'chip-gold'}">${f.severity}</span>
          <span class="chip chip-muted">${esc(f.sectionName)}</span>
          ${a ? `<span class="chip chip-info">${typeLabel(a)} · ${fmtShort(a.date)}</span>` : ''}
        </div>
        <div class="form-grid">
          <div class="field"><label>الحالة</label><select class="select" id="fStatus">
            ${['مفتوح', 'قيد المعالجة', 'مغلق'].map(s => `<option ${s === f.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
          <div class="field"><label>تاريخ الاستحقاق</label><input class="input num" type="date" id="fDue" value="${f.due}"></div>
          <div class="field"><label>المسؤول</label><input class="input" id="fOwner" value="${esc(f.owner)}"></div>
          <div class="field"><label>أُغلقت في</label><input class="input num" type="date" id="fClosed" value="${f.closedAt || ''}"></div>
          <div class="field full"><label>صور التصحيح (مطلوبة عند الإغلاق)</label>
            <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
              ${(f.photos || []).map((src, i) => `<span class="ip"><img src="${src}" alt=""><button type="button" class="ip-x" data-action="del-finding-photo" data-id="${f.id}" data-idx="${i}">${icon('x', 10)}</button></span>`).join('')}
              <label class="photo-btn" title="تصوير بالكاميرا">${icon('camera', 16)}
                <input type="file" accept="image/*" capture="environment" data-findphoto="${f.id}" hidden></label>
              <label class="photo-btn" title="اختيار من المعرض">${icon('upload', 16)}
                <input type="file" accept="image/*" data-findphoto="${f.id}" hidden></label>
              <label class="photo-btn" title="إرفاق PDF">${icon('file', 16)}
                <input type="file" accept="application/pdf" data-findpdf="${f.id}" hidden></label>
              ${(f.files || []).map((fl, i) => `<a class="chip chip-gold" href="${fl.url}" target="_blank" rel="noopener">PDF ${i + 1}</a>
                <button type="button" class="icon-btn sm" data-action="del-finding-file" data-id="${f.id}" data-idx="${i}">${icon('x', 12)}</button>`).join('')}
            </div>
            ${(f.photos || []).length ? '' : '<div class="tiny muted" style="margin-top:6px">أضف صورة واحدة على الأقل قبل إغلاق الملاحظة.</div>'}
          </div>
          <div class="field full"><label>الإجراء التصحيحي</label>
          <div class="ta-wrap"><textarea class="textarea" id="fAction">${esc(f.action || '')}</textarea>
          <button type="button" class="mic-btn floating" data-action="dictate" data-target="#fAction">${icon('mic', 15)}</button></div></div>
        </div>
      </div>
      <div class="drawer-foot"><button class="btn btn-outline" data-action="close-drawer">إلغاء</button><div class="spacer"></div>
        <button class="btn btn-primary" data-action="save-finding" data-id="${f.id}">${icon('check', 15)} حفظ</button></div>`);
  }

  /* ---------------- backups ---------------- */
  function lastBackupLabel() {
    const ts = Number(localStorage.getItem('snam_last_backup') || 0);
    if (!ts) return 'لا توجد نسخة بعد — ستُنشأ تلقائيًا عند أول تعديل.';
    const d = new Date(ts);
    return 'آخر نسخة: ' + d.toLocaleString('ar-SA-u-ca-gregory-nu-latn', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async function backupNow(silent) {
    try {
      const ts = Date.now();
      const raw = JSON.stringify(db);
      await BK.put({ ts, size: raw.length, data: db });
      localStorage.setItem('snam_last_backup', String(ts));
      if (!silent) { toast('تم إنشاء نسخة احتياطية'); render(); }
    } catch (e) {
      toast('تعذر إنشاء النسخة — قد يكون التخزين ممتلئًا أو وضع التصفح الخاص مفعّلًا', 'err');
    }
  }

  async function openBackups() {
    const list = (await BK.all()).sort((a, b) => b.ts - a.ts);
    openModal(`<div class="modal-head"><div><h2>النسخ الاحتياطية</h2><p>${list.length} نسخة محفوظة داخل هذا المتصفح</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body">
        ${list.length ? list.map(x => `<div class="stat-line">
          <div><div style="font-size:12.5px">${new Date(x.ts).toLocaleString('ar-SA-u-ca-gregory-nu-latn', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          <div class="tiny muted">${Math.round(x.size / 1024)} كيلوبايت · ${x.data.audits ? x.data.audits.length : 0} زيارة · ${x.data.branches ? x.data.branches.length : 0} فرع</div></div>
          <div class="row" style="gap:6px">
            <button class="btn btn-outline btn-sm" data-action="download-backup" data-ts="${x.ts}">${icon('download', 13)}</button>
            <button class="btn btn-outline btn-sm" data-action="restore-backup" data-ts="${x.ts}">استعادة</button>
            <button class="btn btn-danger btn-sm" data-action="delete-backup" data-ts="${x.ts}">${icon('trash', 13)}</button>
          </div></div>`).join('') : '<p class="small muted">لا نسخ بعد.</p>'}
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-primary" data-action="close-modal">إغلاق</button></div>`, { size: 'sm' });
  }

  async function restoreBackup(ts) {
    if (!confirm('سيتم استبدال البيانات الحالية بهذه النسخة. متابعة؟')) return;
    const list = await BK.all();
    const snap = list.find(x => String(x.ts) === String(ts));
    if (!snap) { toast('النسخة غير موجودة', 'err'); return; }
    try { await BK.put({ ts: Date.now(), size: JSON.stringify(db).length, data: db }); } catch (e) { }
    db = snap.data;
    ensureSettings();
    lastRemoteTs = 0;
    save();
    closeModal(); render();
    toast('تمت استعادة النسخة — وتُزامن الآن مع السحابة');
  }

  /* ---------------- settings ---------------- */
  let pendingLogo = null;
  function saveSettings() {
    const s = S();
    s.companyName = qs('#set-name').value.trim() || s.companyName;
    s.qualityManagerName = (qs('#set-qm').value || '').trim() || s.qualityManagerName;
    s.supervisorPersonName = (qs('#set-sup').value || '').trim();
    s.ceoName = (qs('#set-ceo') ? (qs('#set-ceo').value || '').trim() : (s.ceoName || ''));
    s.tagline = qs('#set-tagline').value.trim();
    s.serviceName = qs('#set-service').value.trim() || s.serviceName;
    s.serviceDesc = qs('#set-servicedesc').value.trim();
    s.phone = qs('#set-phone').value.trim();
    s.whatsapp = qs('#set-whatsapp').value.trim();
    s.email = qs('#set-email').value.trim();
    s.website = qs('#set-website').value.trim();
    s.address = qs('#set-address').value.trim();
    s.hq = qs('#set-hq').value.trim();
    s.workHours = qs('#set-hours').value.trim();
    s.passScore = Number(qs('#set-pass').value) || 85;
    s.warnScore = Math.min(Number(qs('#set-warn').value) || 70, s.passScore - 1);
    s.year = Number(qs('#set-year').value) || 2026;
    s.landingText = (qs('#set-landing') || {}).value ? qs('#set-landing').value.trim() : (s.landingText || '');
    s.copyrightText = (qs('#set-copy') || {}).value ? qs('#set-copy').value.trim() : (s.copyrightText || '');
    s.copyrightUrl = (qs('#set-copyurl') || {}).value ? qs('#set-copyurl').value.trim() : (s.copyrightUrl || '');
    if (pendingLogo) { s.logo = pendingLogo; pendingLogo = null; }
    save(); render(); toast('تم حفظ الإعدادات');
  }
  function handleLogo(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast('حجم الشعار أكبر من 2MB', 'err'); return; }
    const r = new FileReader();
    r.onload = e => { pendingLogo = e.target.result; const p = qs('#logoPreview'); if (p) p.src = pendingLogo; };
    r.readAsDataURL(file);
  }

  /* ---------------- search ---------------- */
  function openSearch(term = '') {
    openModal(`<div class="modal-head"><div style="flex:1"><h2>البحث</h2><p>الفروع، الزيارات، والملاحظات</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body"><input class="input" id="searchInput" placeholder="اكتب اسم فرع أو كلمة…" value="${esc(term)}" style="margin-bottom:14px">
      <div id="searchResults"></div></div>`, { size: 'sm' });
    const inp = qs('#searchInput');
    inp.addEventListener('input', e => runSearch(e.target.value));
    runSearch(term);
    setTimeout(() => inp.focus(), 60);
  }
  function runSearch(term) {
    const q = (term || '').trim(), box = qs('#searchResults');
    if (!box) return;
    if (q.length < 2) { box.innerHTML = '<p class="small muted">اكتب حرفين على الأقل.</p>'; return; }
    const bs = db.branches.filter(b => (b.name + cityById(b.cityId).name + b.manager).includes(q)).slice(0, 4);
    const as = db.audits.filter(a => (a.id + branchById(a.branchId).name).includes(q)).slice(0, 4);
    const fs = db.findings.filter(f => f.title.includes(q)).slice(0, 4);
    const html =
      (bs.length ? `<div class="nav-label">الفروع</div>` + bs.map(b => `<div class="stat-line" style="cursor:pointer" data-action="open-branch" data-id="${b.id}"><span>${esc(branchLabel(b))}</span><span class="chip chip-gold">${avgScore(auditsOf(b.id, null, S().year))}%</span></div>`).join('') : '') +
      (as.length ? `<div class="nav-label">الزيارات</div>` + as.map(a => `<div class="stat-line" style="cursor:pointer" data-action="view-audit" data-id="${a.id}"><span>${a.id} · ${esc(branchById(a.branchId).name)}</span><span class="tiny muted">${fmtShort(a.date)}</span></div>`).join('') : '') +
      (fs.length ? `<div class="nav-label">الملاحظات</div>` + fs.map(f => `<div class="stat-line" style="cursor:pointer" data-action="open-finding" data-id="${f.id}"><span style="font-size:12px">${esc(f.title)}</span><span class="chip ${f.status === 'مغلق' ? 'chip-ok' : 'chip-warn'}">${f.status}</span></div>`).join('') : '');
    box.innerHTML = html || '<p class="small muted">لا نتائج.</p>';
  }

  function openNotifications() {
    const crit = db.findings.filter(f => f.status !== 'مغلق' && f.severity === 'حرج').slice(0, 5);
    const over = db.findings.filter(f => f.status !== 'مغلق' && f.due < '2026-11-06').slice(0, 5);
    openModal(`<div class="modal-head"><div><h2>التنبيهات</h2><p>${crit.length + over.length} تنبيه</p></div>
      <button class="close-x" data-action="close-modal">${icon('x', 16)}</button></div>
      <div class="modal-body">
        ${crit.length ? `<h3 class="section-title" style="font-size:13px">ملاحظات حرجة</h3>` + crit.map(f => `<div class="stat-line"><span>${esc(f.title)}<br><span class="tiny muted">${esc(branchById(f.branchId).name)}</span></span><button class="btn btn-outline btn-sm" data-action="open-finding" data-id="${f.id}">معالجة</button></div>`).join('') : ''}
        ${over.length ? `<h3 class="section-title" style="font-size:13px;margin-top:14px">تجاوزت الاستحقاق</h3>` + over.map(f => `<div class="stat-line"><span>${esc(f.title)}<br><span class="tiny muted">${fmtDate(f.due)}</span></span><button class="btn btn-outline btn-sm" data-action="open-finding" data-id="${f.id}">متابعة</button></div>`).join('') : ''}
        ${!crit.length && !over.length ? '<p class="small muted">لا تنبيهات.</p>' : ''}
      </div>`, { size: 'sm' });
  }

  /* ---------------- export ---------------- */
  function download(filename, content, mime = 'text/csv;charset=utf-8') {
    const blob = new Blob(['\ufeff' + content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }
  const csvRow = arr => arr.map(v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`).join(',');

  function exportCsv(kind) {
    let rows = [], name = 'snam';
    if (kind === 'visits') {
      name = 'snam-visits';
      rows.push(['رقم الزيارة', 'المنطقة', 'المدينة', 'الفرع', 'الكود', 'النوع', 'التاريخ', 'المدقق', 'النسبة', 'الدرجة من ' + TOTAL_POINTS, 'الحالة']);
      auditsOf(null, null, S().year).forEach(a => {
        const b = branchById(a.branchId);
        rows.push([a.id, regionById(b.regionId).name, cityById(b.cityId).name, b.name, b.code, typeLabel(a), a.date, a.auditor, a.overall + '%', pointsOf(a.overall), a.status]);
      });
    } else if (kind === 'findings') {
      name = 'snam-findings';
      rows.push(['المعرف', 'الملاحظة', 'الفرع', 'القسم', 'الخطورة', 'الحالة', 'المسؤول', 'الاستحقاق']);
      db.findings.forEach(f => rows.push([f.id, f.title, branchById(f.branchId).name, f.sectionName, f.severity, f.status, f.owner, f.due]));
    } else if (kind === 'period') {
      const b = branchById(ui.filters.report.branch);
      const rng2 = reportRange();
      let list = db.audits.filter(a => a.branchId === b.id && a.date >= rng2.from && a.date <= rng2.to);
      name = 'snam-report-' + b.code + '-' + rng2.from + '_' + rng2.to;
      rows.push(['تقرير', b.name, mode === 'monthly' ? MONTHS[mon] + ' ' + yr : String(yr)]);
      rows.push(['الزيارة', 'النوع', 'التاريخ', 'المدقق', 'النسبة', 'من ' + TOTAL_POINTS]);
      list.forEach(a => rows.push([a.id, typeLabel(a), a.date, a.auditor, a.overall + '%', pointsOf(a.overall)]));
    } else if (kind === 'annual') {
      const b = branchById(ui.filters.report.branch);
      name = 'snam-annual-' + b.code;
      rows.push(['التقرير السنوي', b.name, String(S().year)]);
      rows.push(['نوع الزيارة', 'المستهدف', 'المنفذ', 'التغطية']);
      COVERAGE_ORDER.forEach(t => { const c = coverageFor(b.id, t, S().year); rows.push([typeName(t), c.expected, c.executed, c.pct + '%']); });
      rows.push([]); rows.push(['زيارة', 'التاريخ', 'النوع', 'النسبة', 'من ' + TOTAL_POINTS, 'المدقق']);
      auditsOf(b.id, null, S().year).forEach(a => rows.push([a.id, a.date, typeLabel(a), a.overall + '%', pointsOf(a.overall), a.auditor]));
    } else if (kind === 'summary') {
      name = 'snam-summary';
      rows.push(['المنطقة', 'عدد الفروع', 'متوسط الامتثال', 'الدرجة من ' + TOTAL_POINTS]);
      db.regions.forEach(r => {
        const rb = branchesOfRegion(r.id);
        const sc = avgScore(rb.flatMap(b => auditsOf(b.id, null, S().year)));
        rows.push([r.name, rb.length, sc + '%', pointsOf(sc)]);
      });
    } else {
      name = 'snam-branches';
      rows.push(['الكود', 'الفرع', 'المدينة', 'المنطقة', 'المدير', 'الهاتف', 'الزيارات', 'الامتثال', 'الدرجة']);
      db.branches.forEach(b => {
        const a = auditsOf(b.id, null, S().year), sc = avgScore(a);
        rows.push([b.code, b.name, cityById(b.cityId).name, regionById(b.regionId).name, b.manager, b.phone, a.length, sc + '%', pointsOf(sc)]);
      });
    }
    download(`${name}-${S().year}.csv`, rows.map(csvRow).join('\r\n'));
    toast('تم تصدير الملف');
  }


  /* ==================== الموارد البشرية (HR) ==================== */
  function hrDef() {
    return {
      employees: [], attendance: [], requests: [], payroll: [], rewards: [],
      policy: {
        title: 'لائحة العمل الداخلية', version: '1.0', date: '2026-01-01', ack: [],
        articles: [
          { no: 1, title: 'ساعات العمل', text: 'أيام العمل من الأحد إلى الخميس، والساعات من 9:00 صباحًا حتى 5:00 مساءً، مع مرونة نصف ساعة، ويُحتسب التأخير بعد ذلك.' },
          { no: 2, title: 'الحضور والانصراف', text: 'يلتزم الموظف بتسجيل حضوره وانصرافه بنفسه عبر النظام أو البصمة، ولا يجوز تسجيل الحضور نيابة عن غيره.' },
          { no: 3, title: 'الإجازات', text: 'الإجازة السنوية 21 يومًا، والمرضية حسب نظام العمل، وتُقدَّم الطلبات قبل 3 أيام على الأقل عبر النظام ما لم تكن طارئة.' },
          { no: 4, title: 'الرواتب والبدلات', text: 'تُصرف الرواتب شهريًا في موعد أقصاه اليوم الخامس من الشهر التالي، وتُحوَّل على الحساب البنكي المسجل في ملف الموظف.' },
          { no: 5, title: 'الحسميات', text: 'يُحسم عن الغياب غير المبرر بنسبة أجر اليوم، ويُحسم عن التأخير المتكرر حسب ساعات التأخير، وتُطبَّق حسميات الجودة وفق نتائج تقييم الفرع.' },
          { no: 6, title: 'المكافآت والتميز', text: 'يُمنح الموظفون في الفروع الحاصلة على تقييم 90% وأعلى مكافأة تميز شهرية، وتُصرف مع مسير الرواتب بعد اعتماد الموارد البشرية.' },
          { no: 7, title: 'السلوك المهني', text: 'يلتزم الموظف بالزي الرسمي والنظافة الشخصية وحسن التعامل مع العملاء والزملاء، ويُمنع استخدام الجوال أثناء خدمة العميل.' },
          { no: 8, title: 'السلامة والصحة المهنية', text: 'الالتزام بتعليمات السلامة ونظافة الأغذية ودرجات الحرارة، والإبلاغ الفوري عن أي خطر أو إصابة.' },
          { no: 9, title: 'الجزاءات', text: 'تُطبَّق الجزاءات تدريجيًا: تنبيه شفهي، إنذار كتابي، خصم من الراتب وفق النظام، وحالات الفصل النظامية.' },
          { no: 10, title: 'الشكاوى والتظلم', text: 'يحق للموظف تقديم شكوى أو تظلم عبر النظام، وتُدرس خلال 5 أيام عمل، ويُبلَّغ بالقرار كتابيًا.' },
          { no: 11, title: 'إنهاء الخدمة', text: 'يُشعر الموظف قبل إنهاء العقد بالمدة النظامية، وتُصرف مستحقاته وفق نظام العمل السعودي.' }
        ]
      },
      rules: { ded70: 5, ded60: 10, reward90: 300, reward95: 500 },
      settings: { workStart: '09:00', workEnd: '17:00', lateGrace: 10, workDays: [0, 1, 2, 3, 4], gpsRadius: 250, otRate: 1.5 }
    };
  }
  function hrData() {
    if (!db.hr || typeof db.hr !== 'object') db.hr = hrDef();
    ['employees', 'attendance', 'requests', 'payroll'].forEach(k => { if (!Array.isArray(db.hr[k])) db.hr[k] = []; });
    if (!db.hr.settings) db.hr.settings = hrDef().settings;
    if (!db.hr.rules) db.hr.rules = hrDef().rules;
    if (!Array.isArray(db.hr.rewards)) db.hr.rewards = [];
    if (!db.hr.policy || !Array.isArray(db.hr.policy.articles)) db.hr.policy = hrDef().policy;
    if (!Array.isArray(db.hr.policy.ack)) db.hr.policy.ack = [];
    return db.hr;
  }
  const hrRole = () => ((currentUser() || {}).role || '');
  const hrCanEdit = () => ['admin', 'hr'].includes(hrRole());
  const hrCanApprove = () => ['admin', 'hr', 'general_manager', 'ceo'].includes(hrRole());
  const hrSeesPay = () => ['admin', 'hr', 'ceo', 'general_manager'].includes(hrRole());
  const hrCanView = () => ['admin', 'hr', 'ceo', 'general_manager', 'general_supervisor', 'ops_manager', 'branch_manager'].includes(hrRole());
  const hrScopeRegion = () => {
    const u = currentUser(); if (!u) return null;
    if (['admin', 'hr', 'ceo', 'general_manager', 'general_supervisor'].includes(u.role)) return null;
    return (!u.regionId || u.regionId === 'all') ? null : u.regionId;
  };
  const hrScopeBranch = () => {
    const u = currentUser();
    return (u && u.role === 'branch_manager' && u.branchId) ? u.branchId : null;
  };
  function hrBranches() {
    const reg = hrScopeRegion(), br = hrScopeBranch();
    return db.branches.filter(b => (!reg || b.regionId === reg) && (!br || b.id === br));
  }
  function hrEmployees() {
    const ids = new Set(hrBranches().map(b => b.id));
    return hrData().employees.filter(e => (!ids.size ? true : ids.has(e.branchId)) || (currentUser() && currentUser().hrEmp === e.id));
  }
  const hrEmp = id => hrData().employees.find(e => e.id === id) || null;
  const hrDate = () => new Date().toISOString().slice(0, 10);
  const hrNow = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  const hrMoney = n => (Number(n) || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  function hrMonth() { return ui.hrMonth || new Date().toISOString().slice(0, 7); }
  function hrAttOf(empId, date) { return hrData().attendance.find(x => x.empId === empId && x.date === date) || null; }
  function hrAttStatus(rec) {
    if (!rec) return 'absent';
    if (rec.status && rec.status !== 'auto') return rec.status;
    const st = hrData().settings;
    if (!rec.in) return 'absent';
    const grace = Number(st.lateGrace) || 0;
    const [h, m] = rec.in.split(':').map(Number);
    const [sh, sm] = (st.workStart || '09:00').split(':').map(Number);
    return (h * 60 + m) > (sh * 60 + sm + grace) ? 'late' : 'present';
  }
  const hrStatLbl = s => ({ present: 'حاضر', late: 'متأخر', absent: 'غائب', leave: 'إجازة', mission: 'مهمة' }[s] || s);
  const hrStatChip = s => `<span class="chip ${s === 'present' ? 'chip-ok' : s === 'late' ? 'chip-warn' : s === 'leave' ? 'chip-gold' : 'chip-bad'}">${hrStatLbl(s)}</span>`;
  function hrNet(emp) {
    return ['basic', 'housing', 'transport', 'other'].reduce((t, k) => t + (Number(emp[k]) || 0), 0);
  }
  function hrMonthDays(month) {
    const now = new Date();
    const [y, m] = month.split('-').map(Number);
    const last = (month === now.toISOString().slice(0, 7)) ? now.getDate() : new Date(y, m, 0).getDate();
    const st = hrData().settings;
    let work = 0;
    for (let d = 1; d <= last; d++) { if ((st.workDays || [0, 1, 2, 3, 4]).includes(new Date(y, m - 1, d).getDay())) work++; }
    return work;
  }
  function hrEmpMonth(empId, month) {
    const rows = hrData().attendance.filter(x => x.empId === empId && x.date.slice(0, 7) === month);
    let present = 0, late = 0, absent = 0, leave = 0, lateMins = 0;
    const st = hrData().settings;
    rows.forEach(r => {
      const s = hrAttStatus(r);
      if (s === 'present') present++;
      else if (s === 'late') { late++; const [h, m] = (r.in || '0:0').split(':').map(Number); const [sh, sm] = (st.workStart || '09:00').split(':').map(Number); lateMins += Math.max(0, (h * 60 + m) - (sh * 60 + sm)); }
      else if (s === 'leave') leave++;
      else if (s === 'absent') absent++;
    });
    return { rows, present, late, absent, leave, lateMins, attended: present + late };
  }
  function hrGeo() {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }),
        () => resolve(null), { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 });
    });
  }
  function hrDist(a, b) {
    if (!a || !b) return null;
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const q = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return Math.round(2 * R * Math.asin(Math.sqrt(q)));
  }
  function hrConfirm(msg, label) {
    return new Promise(res => {
      openModal(`<div class="modal-head"><h3>${icon('alert', 18)} تأكيد</h3></div>
        <div class="modal-body"><p style="font-size:13.5px;line-height:1.8">${esc(msg)}</p></div>
        <div class="modal-foot"><div class="spacer"></div>
          <button class="btn btn-outline" id="hrCfNo">إلغاء</button>
          <button class="btn btn-primary" id="hrCfYes">${icon('check', 15)} ${esc(label || 'تأكيد')}</button></div>`, { size: 'sm' });
      const y = qs('#hrCfYes'), n = qs('#hrCfNo');
      if (y) y.onclick = () => { closeModal(); res(true); };
      if (n) n.onclick = () => { closeModal(); res(false); };
    });
  }

  const bioKey = empId => 'snam_bio_' + empId;
  function bioB64(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function bioUnb64(s) { const t = s.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(t + '='.repeat((4 - t.length % 4) % 4)); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function bioSupported() { return !!(window.PublicKeyCredential && navigator.credentials && window.isSecureContext); }
  async function bioEnroll(emp) {
    if (!bioSupported()) { toast('جهازك لا يدعم بصمة الجوال', 'err'); return; }
    try {
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          rp: { name: 'نظام سنام', id: location.hostname },
          user: { id: new TextEncoder().encode(emp.id + '|' + emp.mobile), name: emp.id, displayName: emp.name },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred' },
          timeout: 60000
        }
      });
      if (!cred) return;
      localStorage.setItem(bioKey(emp.id), bioB64(cred.rawId));
      toast('تم تسجيل بصمة الجوال لهذا الموظف على هذا الجهاز');
      render();
    } catch (e) { toast('تم إلغاء تسجيل البصمة', 'err'); }
  }
  async function bioVerify(emp) {
    const id = localStorage.getItem(bioKey(emp.id));
    if (!id || !bioSupported()) return 'none';
    try {
      const ok = await navigator.credentials.get({
        publicKey: {
          challenge: crypto.getRandomValues(new Uint8Array(32)),
          allowCredentials: [{ type: 'public-key', id: bioUnb64(id), transports: ['internal'] }],
          userVerification: 'required', timeout: 60000
        }
      });
      return ok ? 'ok' : 'fail';
    } catch (e) { return 'fail'; }
  }

  async function hrPunch(empId, kind) {
    const emp = hrEmp(empId);
    if (!emp) { toast('الموظف غير موجود', 'err'); return; }
    const isSelf = (currentUser() || {}).hrEmp === emp.id || emp.username === (currentUser() || {}).username;
    if (!hrCanEdit() && !isSelf) { toast('ليس لديك صلاحية تسجيل الحضور', 'err'); return; }
    const date = hrDate();
    let rec = hrAttOf(emp.id, date);
    if (!rec) { rec = { id: 'AT-' + Date.now().toString(36), empId: emp.id, date, branchId: emp.branchId, status: 'auto' }; hrData().attendance.push(rec); }
    if (kind === 'in' && rec.in) { toast('سُجّل الحضور مسبقًا اليوم', 'err'); return; }

    const br = branchById(emp.branchId);
    const geo = await hrGeo();
    if (geo && br && br.location) {
      const d = hrDist(geo, br.location);
      const rad = Number(hrData().settings.gpsRadius) || 250;
      if (d != null && d > rad && !hrCanEdit()) {
        toast('أنت بعيد عن الفرع ' + d + ' م — لازم تكون داخل نطاق ' + rad + ' م', 'err'); return;
      }
    }

    /* بصمة الجوال */
    let method = 'manual';
    const hasBio = !!localStorage.getItem(bioKey(emp.id));
    if (hasBio) {
      const v = await bioVerify(emp);
      if (v === 'ok') method = 'biometric';
      else if (v === 'fail') { toast('لم تنجح البصمة — أعد المحاولة', 'err'); return; }
    } else if (!hrCanEdit()) {
      const yes = await hrConfirm((kind === 'in' ? 'تسجيل الحضور' : 'تسجيل الانصراف') + ' للموظف ' + emp.name + ' الساعة ' + hrNow() + '؟', kind === 'in' ? 'تسجيل الحضور' : 'تسجيل الانصراف');
      if (!yes) return;
    }

    rec[kind] = hrNow();
    rec.method = method;
    if (geo) { rec.lat = geo.lat; rec.lng = geo.lng; rec.acc = geo.acc; }
    rec.branchId = emp.branchId;
    if (rec.in && rec.out) rec.status = 'auto';
    save();
    toast((kind === 'in' ? 'تم تسجيل الحضور ' : 'تم تسجيل الانصراف ') + rec[kind] + (method === 'biometric' ? ' ✅ بالبصمة' : ''));
    render();
  }

  function hrEmpForm(emp) {
    const e = emp || { id: '', name: '', no: '', mobile: '', natId: '', branchId: hrBranches()[0] ? hrBranches()[0].id : '', job: '', dept: '', hireDate: hrDate(), contractEnd: '', basic: 0, housing: 0, transport: 0, other: 0, bank: '', iban: '', status: 'active' };
    const opts = hrBranches().map(b => `<option value="${b.id}" ${b.id === e.branchId ? 'selected' : ''}>${esc(b.name)}</option>`).join('');
    openModal(`<div class="modal-head"><div><h2>${emp ? 'تعديل موظف' : 'موظف جديد'}</h2><p class="small muted">بيانات الموظف والراتب</p></div></div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="field"><label>الاسم الكامل *</label><input class="input" id="he_name" value="${esc(e.name)}"></div>
          <div class="field"><label>الرقم الوظيفي</label><input class="input num" id="he_no" value="${esc(e.no || '')}"></div>
          <div class="field"><label>الجوال</label><input class="input num" id="he_mobile" dir="ltr" value="${esc(e.mobile || '')}"></div>
          <div class="field"><label>رقم الهوية / الإقامة</label><input class="input num" id="he_nat" dir="ltr" value="${esc(e.natId || '')}"></div>
          <div class="field"><label>الفرع</label><select class="input" id="he_branch">${opts}</select></div>
          <div class="field"><label>الوظيفة</label><input class="input" id="he_job" value="${esc(e.job || '')}"></div>
          <div class="field"><label>القسم</label><input class="input" id="he_dept" value="${esc(e.dept || '')}"></div>
          <div class="field"><label>تاريخ التعيين</label><input class="input" type="date" id="he_hire" value="${esc(e.hireDate || '')}"></div>
          <div class="field"><label>نهاية العقد</label><input class="input" type="date" id="he_cend" value="${esc(e.contractEnd || '')}"></div>
          <div class="field"><label>الحالة</label><select class="input" id="he_status">
            <option value="active" ${e.status !== 'left' ? 'selected' : ''}>على رأس العمل</option>
            <option value="left" ${e.status === 'left' ? 'selected' : ''}>منتهي</option></select></div>
        </div>
        <h3 class="rep-h" style="margin-top:18px">الراتب والبدلات (شهري)</h3>
        <div class="form-grid">
          <div class="field"><label>الراتب الأساسي</label><input class="input num" type="number" id="he_basic" value="${Number(e.basic) || 0}"></div>
          <div class="field"><label>بدل سكن</label><input class="input num" type="number" id="he_house" value="${Number(e.housing) || 0}"></div>
          <div class="field"><label>بدل نقل</label><input class="input num" type="number" id="he_trans" value="${Number(e.transport) || 0}"></div>
          <div class="field"><label>بدلات أخرى</label><input class="input num" type="number" id="he_other" value="${Number(e.other) || 0}"></div>
          <div class="field"><label>البنك</label><input class="input" id="he_bank" value="${esc(e.bank || '')}"></div>
          <div class="field"><label>IBAN</label><input class="input num" id="he_iban" dir="ltr" value="${esc(e.iban || '')}"></div>
        </div>
      </div>
      <div class="modal-foot"><div class="spacer"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-save-emp" data-id="${e.id}">${icon('check', 15)} حفظ الموظف</button>
      </div>`, { size: 'lg' });
  }

  function hrSaveEmp(id) {
    const g = k => (qs('#he_' + k) || {}).value || '';
    const name = g('name').trim();
    if (!name) { toast('اسم الموظف مطلوب', 'err'); return; }
    const d = hrData();
    let emp = id ? d.employees.find(x => x.id === id) : null;
    if (!emp) { emp = { id: 'E-' + Date.now().toString(36).toUpperCase() }; d.employees.push(emp); }
    Object.assign(emp, {
      name, no: g('no').trim(), mobile: g('mobile').trim(), natId: g('nat').trim(),
      branchId: g('branch'), job: g('job').trim(), dept: g('dept').trim(),
      hireDate: g('hire'), contractEnd: g('cend'), status: g('status'),
      basic: Number(g('basic')) || 0, housing: Number(g('house')) || 0,
      transport: Number(g('trans')) || 0, other: Number(g('other')) || 0,
      bank: g('bank').trim(), iban: g('iban').trim(), updatedAt: new Date().toISOString()
    });
    save(); closeModal(); toast(id ? 'تم تحديث بيانات الموظف' : 'تمت إضافة الموظف');
    render();
  }

  VIEWS.hr = function () {
    if (!hrCanView()) return emptyState('غير مصرح', 'وحدة الموارد البشرية متاحة للإدارة وقسم HR');
    const d = hrData();
    const emps = hrEmployees().filter(e => e.status !== 'left');
    const today = hrDate();
    const att = d.attendance.filter(x => x.date === today && emps.some(e => e.id === x.empId));
    const present = att.filter(x => ['present', 'late'].includes(hrAttStatus(x))).length;
    const late = att.filter(x => hrAttStatus(x) === 'late').length;
    const leave = att.filter(x => hrAttStatus(x) === 'leave').length;
    const absent = Math.max(0, emps.length - present - leave);
    const pending = d.requests.filter(r => r.status === 'pending').length;
    const payRows = d.payroll.filter(p => p.month === hrMonth());
    const netSum = payRows.reduce((t, p) => t + (Number(p.net) || 0), 0);
    const card = (t, v, sub, cls) => `<div class="card hr-kpi ${cls || ''}"><div class="card-body"><div class="tiny muted">${t}</div><div class="hr-kpi-val">${v}</div><div class="tiny muted">${sub || ''}</div></div></div>`;
    return `
      <div class="grid-4" style="margin-bottom:16px">
        ${card('الموظفون على رأس العمل', emps.length, hrBranches().length + ' فرع')}
        ${card('حضور اليوم', present, 'متأخر: ' + late, 'ok')}
        ${card('غائب / إجازة', absent + ' / ' + leave, today, 'warn')}
        ${card('طلبات معلقة', pending, 'بحاجة لقرار', pending ? 'bad' : '')}
        ${hrSeesPay() ? card('مسير ' + hrMonth(), hrMoney(netSum) + ' ر.س', payRows.length + ' موظف') : ''}
      </div>
      <div class="two-col">
        <div class="card"><div class="card-head"><h3>حضور اليوم</h3><div class="spacer"></div><a class="btn btn-outline btn-sm" href="#/hr-att">الكل</a></div>
          <div class="card-body" style="padding:0">
            <table class="tbl"><thead><tr><th>الموظف</th><th>الفرع</th><th>حضور</th><th>انصراف</th><th>الحالة</th></tr></thead><tbody>
            ${emps.length ? emps.slice(0, 8).map(e => { const r = hrAttOf(e.id, today); return `<tr><td>${esc(e.name)}</td><td class="small muted">${esc((branchById(e.branchId) || {}).name || '—')}</td><td class="num">${r && r.in ? r.in : '—'}</td><td class="num">${r && r.out ? r.out : '—'}</td><td>${hrStatChip(hrAttStatus(r))}</td></tr>`; }).join('') : '<tr><td colspan="5" class="muted small">لا يوجد موظفون بعد — أضفهم من «الموظفون»</td></tr>'}
            </tbody></table>
          </div>
        </div>
        <div class="card"><div class="card-head"><h3>طلبات تحتاج قرارك</h3><div class="spacer"></div><a class="btn btn-outline btn-sm" href="#/hr-req">الطلبات</a></div>
          <div class="card-body" style="padding:0">
            <table class="tbl"><thead><tr><th>الموظف</th><th>النوع</th><th>من — إلى</th><th></th></tr></thead><tbody>
            ${d.requests.filter(r => r.status === 'pending').slice(0, 6).map(r => `<tr><td>${esc((hrEmp(r.empId) || {}).name || '—')}</td><td>${esc(r.type)}</td><td class="num small">${esc(r.from || '')} → ${esc(r.to || '')}</td><td><a class="btn btn-outline btn-sm" href="#/hr-req">مراجعة</a></td></tr>`).join('') || '<tr><td colspan="4" class="muted small">لا توجد طلبات معلقة</td></tr>'}
            </tbody></table>
          </div>
        </div>
      </div>`;
  };

  VIEWS['hr-emp'] = function () {
    if (!hrCanView()) return emptyState('غير مصرح', '');
    const list = hrEmployees().filter(e => (ui.hrEmpQ ? (e.name + ' ' + (e.no || '') + ' ' + (e.mobile || '')).includes(ui.hrEmpQ) : true));
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <input class="input" style="max-width:220px" placeholder="بحث بالاسم أو الرقم" id="hrEmpQ" value="${esc(ui.hrEmpQ || '')}">
        ${hrCanEdit() ? `<button class="btn btn-primary btn-sm" data-action="hr-new-emp">${icon('plus', 15)} موظف جديد</button>` : ''}
      </div>
      <div class="card"><div class="card-body" style="padding:0;overflow:auto">
        <div class="toolbar" style="display:flex;justify-content:flex-end;margin-bottom:8px">
          <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="emp">${icon('print', 14)} طباعة كشف الموظفين</button></div>
        <table class="tbl"><thead><tr><th>#</th><th>الاسم</th><th>الوظيفة</th><th>الفرع</th><th>الجوال</th><th>التعيين</th>${hrSeesPay() ? '<th>الراتب</th>' : ''}<th></th></tr></thead><tbody>
        ${list.length ? list.map((e, i) => `<tr>
          <td class="num">${esc(e.no || String(i + 1))}</td>
          <td class="strong">${esc(e.name)}${e.status === 'left' ? ' <span class="chip chip-bad">منتهي</span>' : ''}</td>
          <td class="small">${esc(e.job || '—')}</td>
          <td class="small">${esc((branchById(e.branchId) || {}).name || '—')}</td>
          <td class="num small" dir="ltr">${esc(e.mobile || '—')}</td>
          <td class="num small">${esc(e.hireDate || '—')}</td>
          ${hrSeesPay() ? `<td class="num">${hrMoney(hrNet(e))}</td>` : ''}
          <td style="white-space:nowrap">${hrCanEdit() ? `<button class="btn btn-outline btn-sm" data-action="hr-edit-emp" data-id="${e.id}">تعديل</button> <button class="btn btn-outline btn-sm" data-action="hr-card" data-id="${e.id}" title="بطاقة الموظف">${icon('print', 13)}</button>
          <button class="btn btn-outline btn-sm" data-action="hr-face-enroll" data-id="${e.id}" title="تسجيل الوجه">${icon('camera', 13)}</button>
          <button class="btn btn-outline btn-sm" data-action="hr-mk-login" data-id="${e.id}" title="حساب الموظف">${icon('user', 13)}</button> <button class="btn btn-outline btn-sm" data-action="hr-del-emp" data-id="${e.id}">${icon('trash', 13)}</button>` : ''}</td>
        </tr>`).join('') : '<tr><td colspan="9" class="muted small" style="padding:20px">لا يوجد موظفون مسجلون</td></tr>'}
        </tbody></table>
      </div></div>`;
  };

  VIEWS['hr-att'] = function () {
    if (!hrCanView()) return emptyState('غير مصرح', '');
    const date = ui.hrDate || hrDate();
    const month = date.slice(0, 7);
    const emps = hrEmployees().filter(e => e.status !== 'left');
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <label class="small muted" for="hrAttDate">التاريخ</label>
        <input class="input" type="date" id="hrAttDate" value="${date}" style="max-width:170px">
        <span class="spacer" style="flex:1"></span>
        ${hrCanEdit() ? `<select class="input" id="hrLocBranch" style="max-width:200px">${hrBranches().map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select>
        <button class="btn btn-outline btn-sm" data-action="hr-branch-loc">${icon('store', 14)} تحديد موقع الفرع</button>` : ''}
        <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="att">${icon('print', 14)} طباعة الكشف</button>
        <button class="btn btn-outline btn-sm" data-action="hr-sync-att">${icon('calendar', 14)} تحديث</button>
      </div>
      <div class="card" style="margin-bottom:16px"><div class="card-head"><h3>سجل يوم ${fmtDate(date)}</h3></div>
        <div class="card-body" style="padding:0;overflow:auto"><table class="tbl"><thead><tr><th>الموظف</th><th>الفرع</th><th>حضور</th><th>انصراف</th><th>الحالة</th><th>الطريقة</th><th></th></tr></thead><tbody>
        ${emps.length ? emps.map(e => { const r = hrAttOf(e.id, date); const st = hrAttStatus(r); const hasBio = !!localStorage.getItem(bioKey(e.id)); return `<tr>
          <td class="strong">${esc(e.name)}</td>
          <td class="small muted">${esc((branchById(e.branchId) || {}).name || '—')}</td>
          <td class="num">${r && r.in ? r.in : '—'}</td>
          <td class="num">${r && r.out ? r.out : '—'}</td>
          <td>${hrStatChip(st)}</td>
          <td class="tiny muted">${r && r.method === 'biometric' ? 'بصمة' : r ? 'يدوي' : (hasBio ? 'بصمة مسجلة' : '—')}</td>
          <td style="white-space:nowrap">
            <button class="btn btn-outline btn-sm" data-action="hr-punch" data-id="${e.id}" data-kind="in">حضور</button>
            <button class="btn btn-outline btn-sm" data-action="hr-punch" data-id="${e.id}" data-kind="out">انصراف</button>
            ${hrCanEdit() ? `<button class="btn btn-outline btn-sm" data-action="hr-att-edit" data-id="${e.id}">${icon('edit', 13)}</button>` : ''}
          </td></tr>`; }).join('') : '<tr><td colspan="7" class="muted small" style="padding:20px">أضف موظفين أولًا</td></tr>'}
        </tbody></table></div></div>
      <div class="card"><div class="card-head"><h3>ملخص شهر ${month}</h3></div><div class="card-body" style="padding:0;overflow:auto">
        <table class="tbl"><thead><tr><th>الموظف</th><th>أيام الحضور</th><th>التأخير</th><th>الغياب</th><th>الإجازات</th><th>دقائق التأخير</th></tr></thead><tbody>
        ${emps.map(e => { const s = hrEmpMonth(e.id, month); return `<tr><td>${esc(e.name)}</td><td class="num">${s.attended}</td><td class="num">${s.late}</td><td class="num">${s.absent}</td><td class="num">${s.leave}</td><td class="num">${s.lateMins}</td></tr>`; }).join('') || '<tr><td colspan="6" class="muted small">—</td></tr>'}
        </tbody></table></div></div>`;
  };

  VIEWS['hr-req'] = function () {
    if (!hrCanView()) return emptyState('غير مصرح', '');
    const d = hrData();
    const rows = d.requests.filter(r => { const e = hrEmp(r.empId); return !e || hrEmployees().some(x => x.id === e.id); }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return `<div class="toolbar" style="display:flex;gap:8px;margin-bottom:12px"><button class="btn btn-primary btn-sm" data-action="hr-new-req">${icon('plus', 15)} طلب جديد</button>
      <span style="flex:1"></span>
      <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="req">${icon('print', 14)} طباعة الطلبات</button></div>
      <div class="card"><div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الموظف</th><th>النوع</th><th>من</th><th>إلى</th><th>الأيام</th><th>المبلغ</th><th>السبب</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${rows.length ? rows.map(r => `<tr>
          <td class="strong">${esc((hrEmp(r.empId) || {}).name || '—')}</td>
          <td>${esc(r.type)}</td><td class="num small">${esc(r.from || '—')}</td><td class="num small">${esc(r.to || '—')}</td>
          <td class="num">${r.days || '—'}</td><td class="num">${r.amount ? hrMoney(r.amount) : '—'}</td>
          <td class="small muted" style="max-width:220px">${esc(r.reason || '')}</td>
          <td><span class="chip ${r.status === 'approved' ? 'chip-ok' : r.status === 'rejected' ? 'chip-bad' : 'chip-warn'}">${r.status === 'approved' ? 'معتمد' : r.status === 'rejected' ? 'مرفوض' : 'معلق'}</span></td>
          <td style="white-space:nowrap">${r.status === 'pending' && hrCanApprove() ? `<button class="btn btn-primary btn-sm" data-action="hr-req-ok" data-id="${r.id}">اعتماد</button> <button class="btn btn-outline btn-sm" data-action="hr-req-no" data-id="${r.id}">رفض</button>` : ''}</td>
        </tr>`).join('') : '<tr><td colspan="9" class="muted small" style="padding:20px">لا توجد طلبات</td></tr>'}
      </tbody></table></div></div>`;
  };

  VIEWS['hr-pay'] = function () {
    if (!hrSeesPay()) return emptyState('غير مصرح', 'الرواتب متاحة للإدارة و HR فقط');
    const d = hrData(), month = hrMonth();
    const rows = d.payroll.filter(p => p.month === month);
    const total = rows.reduce((t, p) => t + (Number(p.net) || 0), 0);
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <label class="small muted">الشهر</label>
        <input class="input" type="month" id="hrPayMonth" value="${month}" style="max-width:170px">
        <button class="btn btn-outline btn-sm" data-action="hr-pay-load">عرض</button>
        <span style="flex:1"></span>
        <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="pay">${icon('print', 14)} طباعة المسير</button>
        <button class="btn btn-primary btn-sm" data-action="hr-gen-pay">${icon('calendar', 14)} توليد المسير من الحضور</button>
      </div>
      <div class="card"><div class="card-head"><h3>مسير رواتب ${month}</h3><div class="spacer"></div><b class="num">${hrMoney(total)} ر.س</b></div>
      <div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الموظف</th><th>الأساسي</th><th>البدلات</th><th>إضافي</th><th>مكافأة</th><th>أيام غياب</th><th>خصم (غياب + جودة)</th><th>الصافي</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${rows.length ? rows.map(p => { const e = hrEmp(p.empId) || {}; return `<tr>
          <td class="strong">${esc(e.name || '—')}</td><td class="num">${hrMoney(p.basic)}</td><td class="num">${hrMoney((p.housing || 0) + (p.transport || 0) + (p.other || 0))}</td>
          <td class="num">${hrMoney(p.overtime)}</td><td class="num" style="color:var(--ok)">${hrMoney(p.reward)}</td><td class="num">${p.absenceDays || 0}</td>
          <td class="num" style="color:var(--bad)">${hrMoney(p.deductions)}${p.qualityPct ? `<div class="tiny muted">جودة ${p.qualityPct}% (${p.branchAvg}%)</div>` : ''}</td>
          <td class="num strong">${hrMoney(p.net)}</td>
          <td><span class="chip ${p.status === 'paid' ? 'chip-ok' : p.status === 'approved' ? 'chip-gold' : 'chip-warn'}">${p.status === 'paid' ? 'مصروف' : p.status === 'approved' ? 'معتمد' : 'مسودة'}</span></td>
          <td style="white-space:nowrap"><button class="btn btn-outline btn-sm" data-action="hr-payslip" data-id="${p.id}">قسيمة</button> <button class="btn btn-outline btn-sm" data-action="hr-pay-edit" data-id="${p.id}">${icon('edit', 13)}</button></td>
        </tr>`; }).join('') : '<tr><td colspan="10" class="muted small" style="padding:20px">لا يوجد مسير لهذا الشهر — اضغط «توليد المسير»</td></tr>'}
      </tbody></table></div></div>`;
  };

  function hrGenPay(month) {
    const d = hrData();
    const emps = hrEmployees().filter(e => e.status !== 'left');
    d.payroll = d.payroll.filter(p => p.month !== month);
    emps.forEach(e => {
      const s = hrEmpMonth(e.id, month);
      const basic = Number(e.basic) || 0;
      const dayRate = basic / 30;
      const lateDed = (basic / 30 / 8 / 60) * s.lateMins;
      const absDays = Math.max(0, hrMonthDays(month) - s.attended - s.leave);
      s.absent = absDays;
      const q = hrQualityDed(month, e.branchId);
      const qDed = Math.round(basic * (q.pct || 0) / 100);
      const rwRow = d.rewards.find(r => r.month === month && r.empId === e.id && r.status === 'approved');
      const reward = rwRow ? Number(rwRow.amount) || 0 : 0;
      const deductions = Math.round(dayRate * absDays + lateDed + qDed);
      const gross = basic + (Number(e.housing) || 0) + (Number(e.transport) || 0) + (Number(e.other) || 0);
      d.payroll.push({
        id: 'P-' + month + '-' + e.id, month, empId: e.id, branchId: e.branchId,
        basic, housing: Number(e.housing) || 0, transport: Number(e.transport) || 0, other: Number(e.other) || 0,
        overtime: 0, absenceDays: s.absent, lateMins: s.lateMins, deductions, gross,
        qualityPct: q.pct || 0, qualityDed: qDed, branchAvg: q.avg, reward,
        net: gross + reward - deductions, status: 'draft', generatedAt: new Date().toISOString()
      });
    });
    save();
    toast('تم توليد مسير ' + month + ' لـ ' + emps.length + ' موظف');
    render();
  }

  function hrPayEdit(id) {
    const p = hrData().payroll.find(x => x.id === id); if (!p) return;
    const e = hrEmp(p.empId) || {};
    openModal(`<div class="modal-head"><div><h2>تعديل مسير — ${esc(e.name || '')}</h2><p class="small muted">${p.month}</p></div></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>الراتب الأساسي</label><input class="input num" type="number" id="hp_basic" value="${p.basic}"></div>
        <div class="field"><label>بدل سكن</label><input class="input num" type="number" id="hp_house" value="${p.housing || 0}"></div>
        <div class="field"><label>بدل نقل</label><input class="input num" type="number" id="hp_trans" value="${p.transport || 0}"></div>
        <div class="field"><label>بدلات أخرى</label><input class="input num" type="number" id="hp_other" value="${p.other || 0}"></div>
        <div class="field"><label>ساعات إضافية (مبلغ)</label><input class="input num" type="number" id="hp_ot" value="${p.overtime || 0}"></div>
        <div class="field"><label>خصومات أخرى (مبلغ)</label><input class="input num" type="number" id="hp_ded" value="${p.deductions || 0}"></div>
        <div class="field"><label>أيام الغياب</label><input class="input num" type="number" id="hp_abs" value="${p.absenceDays || 0}"></div>
        <div class="field"><label>الحالة</label><select class="input" id="hp_status">
          <option value="draft" ${p.status === 'draft' ? 'selected' : ''}>مسودة</option>
          <option value="approved" ${p.status === 'approved' ? 'selected' : ''}>معتمد</option>
          <option value="paid" ${p.status === 'paid' ? 'selected' : ''}>مصروف</option></select></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-pay-save" data-id="${p.id}">حفظ</button></div>`, { size: 'lg' });
  }

  function hrPaySave(id) {
    const p = hrData().payroll.find(x => x.id === id); if (!p) return;
    const n = k => Number((qs('#hp_' + k) || {}).value) || 0;
    p.basic = n('basic'); p.housing = n('house'); p.transport = n('trans'); p.other = n('other');
    p.overtime = n('ot'); p.deductions = n('ded'); p.absenceDays = n('abs');
    p.gross = p.basic + p.housing + p.transport + p.other;
    p.net = p.gross + p.overtime - p.deductions;
    p.status = (qs('#hp_status') || {}).value || 'draft';
    save(); closeModal(); toast('تم تحديث المسير'); render();
  }

  function hrPayslip(id) {
    const d = hrData();
    const p = d.payroll.find(x => x.id === id); if (!p) return;
    const e = hrEmp(p.empId) || {};
    const s = S();
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>قسيمة راتب — ${esc(e.name || '')}</title>
      <style>body{font-family:Tahoma,Arial,sans-serif;padding:28px;color:#222}
      h1{font-size:20px;margin:0 0 4px}.muted{color:#777;font-size:12px}
      table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px}
      th,td{border:1px solid #ccc;padding:8px;text-align:right}th{background:#f4f1ea}
      .tot{margin-top:16px;font-size:15px;font-weight:bold;background:#f4f1ea;padding:12px;border:1px solid #ccc}
      .head{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #7A5C2E;padding-bottom:12px}
      .sig{margin-top:46px;display:flex;justify-content:space-between;font-size:12px}
      .sig div{width:30%;border-top:1px solid #999;padding-top:8px;text-align:center}</style></head><body>
      <div class="head"><div><h1>${esc(s.companyName || 'شركة سنام')}</h1><div class="muted">${esc(s.tagline || '')}</div></div>
      <div style="text-align:left"><b>قسيمة راتب</b><div class="muted">${p.month}</div></div></div>
      <table><tr><th>الموظف</th><td>${esc(e.name || '')}</td><th>الرقم الوظيفي</th><td>${esc(e.no || '—')}</td></tr>
      <tr><th>الفرع</th><td>${esc((branchById(e.branchId) || {}).name || '—')}</td><th>الوظيفة</th><td>${esc(e.job || '—')}</td></tr>
      <tr><th>IBAN</th><td colspan="3">${esc(e.iban || '—')}</td></tr></table>
      <table><thead><tr><th>البند</th><th>المبلغ</th></tr></thead><tbody>
      <tr><td>الراتب الأساسي</td><td>${hrMoney(p.basic)}</td></tr>
      <tr><td>بدل سكن</td><td>${hrMoney(p.housing)}</td></tr>
      <tr><td>بدل نقل</td><td>${hrMoney(p.transport)}</td></tr>
      <tr><td>بدلات أخرى</td><td>${hrMoney(p.other)}</td></tr>
      <tr><td>أجر إضافي</td><td>${hrMoney(p.overtime)}</td></tr>
      <tr><td>مكافأة تميز</td><td>${hrMoney(p.reward)}</td></tr>
      <tr><td>خصم غياب وتأخير (${p.absenceDays || 0} يوم)</td><td>-${hrMoney((p.deductions || 0) - (p.qualityDed || 0))}</td></tr>
      <tr><td>خصم جودة${p.qualityPct ? ` (${p.qualityPct}% — تقييم ${p.branchAvg}%)` : ''}</td><td>-${hrMoney(p.qualityDed)}</td></tr>
      </tbody></table>
      <div class="tot">الصافي المستحق: ${hrMoney(p.net)} ريال</div>
      <div class="sig"><div>الموظف</div><div>الموارد البشرية</div><div>المدير المالي</div></div>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) { toast('اسمح بالنوافذ المنبثقة لطباعة القسيمة', 'err'); return; }
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) { } }, 500);
  }

  function hrAttEdit(empId) {
    const date = ui.hrDate || hrDate();
    const e = hrEmp(empId); if (!e) return;
    const r = hrAttOf(empId, date) || { in: '', out: '', status: 'auto', note: '' };
    openModal(`<div class="modal-head"><div><h2>تعديل حضور — ${esc(e.name)}</h2><p class="small muted">${fmtDate(date)}</p></div></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>وقت الحضور</label><input class="input num" type="time" id="ha_in" value="${esc(r.in || '')}"></div>
        <div class="field"><label>وقت الانصراف</label><input class="input num" type="time" id="ha_out" value="${esc(r.out || '')}"></div>
        <div class="field"><label>الحالة</label><select class="input" id="ha_status">
          <option value="auto" ${(!r.status || r.status === 'auto') ? 'selected' : ''}>تلقائي حسب الوقت</option>
          <option value="present" ${r.status === 'present' ? 'selected' : ''}>حاضر</option>
          <option value="late" ${r.status === 'late' ? 'selected' : ''}>متأخر</option>
          <option value="leave" ${r.status === 'leave' ? 'selected' : ''}>إجازة</option>
          <option value="mission" ${r.status === 'mission' ? 'selected' : ''}>مهمة عمل</option>
          <option value="absent" ${r.status === 'absent' ? 'selected' : ''}>غائب</option></select></div>
        <div class="field"><label>ملاحظة</label><input class="input" id="ha_note" value="${esc(r.note || '')}"></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-att-save" data-id="${empId}">حفظ</button></div>`, { size: 'sm' });
  }

  function hrAttSave(empId) {
    const date = ui.hrDate || hrDate();
    const d = hrData();
    let r = hrAttOf(empId, date);
    if (!r) { r = { id: 'AT-' + Date.now().toString(36), empId, date, branchId: (hrEmp(empId) || {}).branchId, method: 'manual' }; d.attendance.push(r); }
    r.in = (qs('#ha_in') || {}).value || '';
    r.out = (qs('#ha_out') || {}).value || '';
    r.status = (qs('#ha_status') || {}).value || 'auto';
    r.note = (qs('#ha_note') || {}).value || '';
    r.method = 'manual';
    save(); closeModal(); toast('تم حفظ الحضور'); render();
  }

  function hrReqForm() {
    const opts = hrEmployees().filter(e => e.status !== 'left').map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
    openModal(`<div class="modal-head"><div><h2>طلب جديد</h2><p class="small muted">إجازة / سلفة / مخالصة / خطاب</p></div></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>الموظف</label><select class="input" id="hr_emp">${opts}</select></div>
        <div class="field"><label>نوع الطلب</label><select class="input" id="hr_type">
          <option>إجازة سنوية</option><option>إجازة مرضية</option><option>إجازة طارئة</option>
          <option>سلفة</option><option>مخالصة</option><option>خطاب تعريف</option><option>استقالة</option></select></div>
        <div class="field"><label>من</label><input class="input" type="date" id="hr_from"></div>
        <div class="field"><label>إلى</label><input class="input" type="date" id="hr_to"></div>
        <div class="field"><label>عدد الأيام</label><input class="input num" type="number" id="hr_days" value="1"></div>
        <div class="field"><label>المبلغ (للسلفة)</label><input class="input num" type="number" id="hr_amount" value=""></div>
      </div>
      <div class="field" style="margin-top:10px"><label>السبب / التفاصيل</label><textarea class="input" id="hr_reason" rows="3"></textarea></div>
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-save-req">حفظ الطلب</button></div>`, { size: 'lg' });
  }

  function hrSaveReq() {
    const g = k => (qs('#hr_' + k) || {}).value || '';
    if (!g('emp')) { toast('اختر الموظف', 'err'); return; }
    const d = hrData();
    d.requests.unshift({
      id: 'RQ-' + Date.now().toString(36).toUpperCase(), empId: g('emp'), type: g('type'),
      from: g('from'), to: g('to'), days: Number(g('days')) || 1, amount: Number(g('amount')) || 0,
      reason: g('reason'), status: 'pending', createdAt: new Date().toISOString(),
      createdBy: (currentUser() || {}).username
    });
    save(); closeModal(); toast('تم إرسال الطلب'); render();
  }


  /* ---------- لائحة العمل والمكافآت ---------- */
  function hrBranchAvg(month, branchId) {
    const list = (db.audits || []).filter(a => !a.kind && a.branchId === branchId && String(a.date || '').slice(0, 7) === month);
    if (!list.length) return null;
    return Math.round(list.reduce((t, a) => t + (Number(a.overall) || 0), 0) / list.length);
  }
  function hrQualityDed(month, branchId) {
    const avg = hrBranchAvg(month, branchId);
    const r = hrData().rules || {};
    if (avg == null) return { avg: null, pct: 0 };
    if (avg < 60) return { avg, pct: Number(r.ded60) || 10 };
    if (avg < 70) return { avg, pct: Number(r.ded70) || 5 };
    return { avg, pct: 0 };
  }
  function hrRewardAmount(avg) {
    const r = hrData().rules || {};
    if (avg == null) return 0;
    if (avg >= 95) return Number(r.reward95) || 0;
    if (avg >= 90) return Number(r.reward90) || 0;
    return 0;
  }

  VIEWS['hr-policy'] = function () {
    if (!hrCanView()) return emptyState('غير مصرح', '');
    const p = hrData().policy;
    const me = (currentUser() || {});
    const myEmp = hrData().employees.find(e => e.username === me.username || e.id === me.hrEmp);
    const acked = myEmp ? (p.ack || []).find(a => a.empId === myEmp.id) : null;
    return `<div class="card"><div class="card-head"><div><h3>${esc(p.title || 'لائحة العمل الداخلية')}</h3>
        <div class="tiny muted">إصدار ${esc(p.version || '1.0')} · سارية من ${fmtDate(p.date || '')}</div></div>
        <div class="spacer"></div>
        <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="policy">${icon('print', 14)} طباعة اللائحة</button>
        ${hrCanEdit() ? `<button class="btn btn-outline btn-sm" data-action="hr-policy-edit">${icon('edit', 14)} تعديل اللائحة</button>` : ''}
      </div>
      <div class="card-body">
        ${(p.articles || []).map(a => `<div class="hr-article"><h4>${a.no}. ${esc(a.title)}</h4><p>${esc(a.text)}</p></div>`).join('')}
        ${myEmp ? `<div class="hr-ack">${acked
          ? `<span class="chip chip-ok">تم الاطلاع والموافقة — ${fmtDate(String(acked.at).slice(0, 10))}</span>`
          : `<div class="small">أقرّ بأنني اطلعت على لائحة العمل الداخلية وأوافق على ما ورد فيها.</div>
             <button class="btn btn-primary btn-sm" data-action="hr-policy-ack" data-id="${myEmp.id}" style="margin-top:8px">${icon('check', 14)} أوافق على اللائحة</button>`}</div>` : ''}
      </div></div>`;
  };

  function hrPolicyEdit() {
    const p = hrData().policy;
    openModal(`<div class="modal-head"><div><h2>تعديل لائحة العمل</h2><p class="small muted">تُحفظ نسخة معتمدة لكل تعديل</p></div></div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="field"><label>عنوان اللائحة</label><input class="input" id="hp_title" value="${esc(p.title || '')}"></div>
          <div class="field"><label>الإصدار</label><input class="input num" id="hp_ver" value="${esc(p.version || '1.0')}"></div>
          <div class="field"><label>سارية من</label><input class="input" type="date" id="hp_date" value="${esc(p.date || '')}"></div>
        </div>
        <div class="field" style="margin-top:12px"><label>المواد (كل مادة: رقم | العنوان | النص في سطر)</label>
          <textarea class="input num" id="hp_articles" rows="16" dir="rtl">${esc((p.articles || []).map(a => a.no + ' | ' + a.title + ' | ' + a.text).join('\n'))}</textarea></div>
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-policy-save">حفظ اللائحة</button></div>`, { size: 'lg' });
  }

  function hrPolicySave() {
    const p = hrData().policy;
    p.title = (qs('#hp_title') || {}).value || p.title;
    p.version = (qs('#hp_ver') || {}).value || p.version;
    p.date = (qs('#hp_date') || {}).value || p.date;
    const raw = (qs('#hp_articles') || {}).value || '';
    const arts = raw.split('\n').map(l => l.trim()).filter(Boolean).map((l, i) => {
      const parts = l.split('|');
      return { no: Number(parts[0]) || (i + 1), title: (parts[1] || '').trim(), text: (parts.slice(2).join('|') || '').trim() };
    });
    if (!arts.length) { toast('أضف مادة واحدة على الأقل', 'err'); return; }
    p.articles = arts;
    p.ack = [];   /* أي تعديل يلزم إعادة الإقرار */
    p.updatedAt = new Date().toISOString();
    save(); closeModal(); toast('تم حفظ اللائحة — يجب على الموظفين الإقرار من جديد'); render();
  }

  VIEWS['hr-reward'] = function () {
    if (!hrCanView()) return emptyState('غير مصرح', '');
    const month = ui.hrMonth || new Date().toISOString().slice(0, 7);
    const d = hrData();
    const rows = d.rewards.filter(r => r.month === month);
    const emps = hrEmployees().filter(e => e.status !== 'left');
    const rl = d.rules || {};
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <label class="small muted">الشهر</label>
        <input class="input" type="month" id="hrRwMonth" value="${month}" style="max-width:170px">
        <button class="btn btn-outline btn-sm" data-action="hr-rw-load">عرض</button>
        <span style="flex:1"></span>
        <button class="btn btn-outline btn-sm" data-action="hr-print" data-kind="rw">${icon('print', 14)} طباعة المكافآت</button>
        ${hrCanEdit() ? `<button class="btn btn-primary btn-sm" data-action="hr-rw-gen">${icon('star', 14)} احتساب المتميزين من التقييمات</button>` : ''}
      </div>
      <div class="card" style="margin-bottom:14px"><div class="card-body small muted">
        القاعدة الحالية: مكافأة <b>${hrMoney(rl.reward90)} ر.س</b> للفرع الحاصل على 90% وأعلى، و<b>${hrMoney(rl.reward95)} ر.س</b> لـ95% وأعلى.
        ${hrCanEdit() ? '<a href="#/hr-settings" class="small">تعديل القواعد</a>' : ''}
      </div></div>
      <div class="card"><div class="card-head"><h3>مكافآت ${month}</h3></div>
      <div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الموظف</th><th>الفرع</th><th>تقييم الفرع</th><th>المكافأة</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${rows.length ? rows.map(r => { const e = hrEmp(r.empId) || {}; return `<tr>
          <td class="strong">${esc(e.name || '—')}</td><td class="small">${esc((branchById(r.branchId) || {}).name || '—')}</td>
          <td class="num">${r.avg != null ? r.avg + '%' : '—'}</td><td class="num">${hrMoney(r.amount)}</td>
          <td><span class="chip ${r.status === 'approved' ? 'chip-ok' : 'chip-warn'}">${r.status === 'approved' ? 'معتمدة' : 'مسودة'}</span></td>
          <td>${hrCanEdit() && r.status !== 'approved' ? `<button class="btn btn-outline btn-sm" data-action="hr-rw-ok" data-id="${r.id}">اعتماد</button>` : ''}</td>
        </tr>`; }).join('') : `<tr><td colspan="6" class="muted small" style="padding:20px">لا توجد مكافآت — اضغط «احتساب المتميزين»${emps.length ? '' : ' (أضف موظفين أولًا)'}</td></tr>`}
      </tbody></table></div></div>`;
  };

  function hrRewardGen(month) {
    const d = hrData();
    const emps = hrEmployees().filter(e => e.status !== 'left');
    d.rewards = d.rewards.filter(r => r.month !== month);
    let n = 0;
    emps.forEach(e => {
      const avg = hrBranchAvg(month, e.branchId);
      const amt = hrRewardAmount(avg);
      if (amt > 0) {
        d.rewards.push({ id: 'RW-' + month + '-' + e.id, month, empId: e.id, branchId: e.branchId, avg, amount: amt, status: 'draft' });
        n++;
      }
    });
    save(); toast('تم احتساب ' + n + ' مكافأة تميز'); render();
  }

  VIEWS['hr-settings'] = function () {
    if (!hrCanEdit()) return emptyState('غير مصرح', 'قواعد الرواتب والمكافآت لـ HR فقط');
    const d = hrData(), r = d.rules || {}, st = d.settings || {};
    return `<div class="card"><div class="card-head"><h3>قواعد الحسميات والمكافآت</h3></div><div class="card-body"><div class="form-grid">
        <div class="field"><label>خصم عند تقييم الفرع أقل من 70%</label><input class="input num" type="number" id="hs_ded70" value="${r.ded70 || 5}"> <span class="tiny muted">% من الأساسي</span></div>
        <div class="field"><label>خصم عند تقييم أقل من 60%</label><input class="input num" type="number" id="hs_ded60" value="${r.ded60 || 10}"> <span class="tiny muted">% من الأساسي</span></div>
        <div class="field"><label>مكافأة تميز (90% وأعلى)</label><input class="input num" type="number" id="hs_rw90" value="${r.reward90 || 300}"> <span class="tiny muted">ر.س</span></div>
        <div class="field"><label>مكافأة تميز (95% وأعلى)</label><input class="input num" type="number" id="hs_rw95" value="${r.reward95 || 500}"> <span class="tiny muted">ر.س</span></div>
        <div class="field"><label>بداية الدوام</label><input class="input num" type="time" id="hs_start" value="${st.workStart || '09:00'}"></div>
        <div class="field"><label>نهاية الدوام</label><input class="input num" type="time" id="hs_end" value="${st.workEnd || '17:00'}"></div>
        <div class="field"><label>سماحية التأخير (دقيقة)</label><input class="input num" type="number" id="hs_grace" value="${st.lateGrace || 10}"></div>
        <div class="field"><label>نطاق الموقع المسموح (متر)</label><input class="input num" type="number" id="hs_radius" value="${st.gpsRadius || 250}"></div>
      </div>
      <div class="card-foot" style="margin-top:14px"><button class="btn btn-primary" data-action="hr-settings-save">${icon('check', 15)} حفظ القواعد</button></div>
      </div></div>`;
  };

  function hrSettingsSave() {
    const d = hrData(), r = d.rules, st = d.settings;
    const n = k => Number((qs('#hs_' + k) || {}).value) || 0;
    r.ded70 = n('ded70'); r.ded60 = n('ded60'); r.reward90 = n('rw90'); r.reward95 = n('rw95');
    st.workStart = (qs('#hs_start') || {}).value || st.workStart;
    st.workEnd = (qs('#hs_end') || {}).value || st.workEnd;
    st.lateGrace = n('grace'); st.gpsRadius = n('radius');
    save(); toast('تم حفظ القواعد'); render();
  }


  /* ---------- بصمة الوجه (face-api) ---------- */
  const FACE_CDN = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
  const FACE_W = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
  let faceReady = null, faceStream = null;
  function loadFace() {
    if (faceReady) return faceReady;
    faceReady = (async () => {
      if (!window.faceapi) {
        await new Promise((res, rej) => {
          const s = document.createElement('script'); s.src = FACE_CDN;
          s.onload = res; s.onerror = () => rej(new Error('face-cdn'));
          document.head.appendChild(s);
        });
      }
      await faceapi.nets.tinyFaceDetector.loadFromUri(FACE_W);
      await faceapi.nets.faceLandmark68Net.loadFromUri(FACE_W);
      await faceapi.nets.faceRecognitionNet.loadFromUri(FACE_W);
      return faceapi;
    })();
    return faceReady;
  }
  async function faceDesc(video) {
    const r = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
      .withFaceLandmarks().withFaceDescriptor();
    return r ? Array.from(r.descriptor) : null;
  }
  function faceDist(a, b) { if (!a || !b) return 9; let s = 0; for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2; return Math.sqrt(s); }
  function stopFaceCam() { if (faceStream) { faceStream.getTracks().forEach(t => t.stop()); faceStream = null; } }

  function faceModal(title, sub, mode, emp, cb) {
    openModal(`<div class="modal-head"><div><h2>${esc(title)}</h2><p class="small muted">${esc(sub || '')}</p></div></div>
      <div class="modal-body" style="text-align:center">
        <div class="face-wrap"><video id="faceVid" autoplay playsinline muted></video><div class="face-ring" id="faceRing"></div></div>
        <p class="small" id="faceMsg" style="margin-top:10px">جارٍ تشغيل الكاميرا…</p>
        <button class="btn btn-primary" id="faceShoot" style="display:none">${icon('camera', 15)} ${mode === 'enroll' ? 'تسجيل الوجه' : 'تحقق ودخول'}</button>
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal" id="faceCancel">إلغاء</button></div>`, { size: 'sm' });
    const vid = qs('#faceVid'), msg = qs('#faceMsg'), shoot = qs('#faceShoot'), ring = qs('#faceRing');
    qs('#faceCancel').onclick = () => { stopFaceCam(); closeModal(); };
    (async () => {
      try {
        await loadFace();
        faceStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false });
        vid.srcObject = faceStream;
        await vid.play().catch(() => { });
        msg.textContent = 'وجّه وجهك داخل الدائرة…';
        const tick = async () => {
          if (!faceStream) return;
          try {
            const r = await faceapi.detectSingleFace(vid, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 }));
            if (r) { ring.classList.add('ok'); msg.textContent = 'تم التعرف على الوجه — اضغط الزر'; shoot.style.display = 'inline-flex'; }
            else { ring.classList.remove('ok'); shoot.style.display = 'none'; msg.textContent = 'لم يُعثر على وجه واضح — اقترب من الكاميرا'; }
          } catch (e) { }
          if (faceStream) setTimeout(tick, 700);
        };
        tick();
      } catch (e) {
        msg.textContent = 'تعذّر تشغيل الكاميرا أو تحميل نموذج الوجه. تأكد من السماح بالكاميرا ومن الإنترنت.';
      }
    })();
    shoot.onclick = async () => {
      shoot.disabled = true; shoot.textContent = 'جارٍ التحقق…';
      try {
        const d = await faceDesc(vid);
        if (!d) { shoot.disabled = false; shoot.textContent = 'أعد المحاولة'; msg.textContent = 'التقط وجهًا واضحًا'; return; }
        stopFaceCam(); closeModal();
        cb(d);
      } catch (e) { stopFaceCam(); closeModal(); toast('تعذّر قراءة الوجه', 'err'); }
    };
    const obs = new MutationObserver(() => { if (!document.querySelector('#faceVid')) { stopFaceCam(); obs.disconnect(); } });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- بوابة الموظف ---------- */
  function meEmployee() {
    const u = currentUser(); if (!u) return null;
    return hrData().employees.find(e => e.username === u.username || e.id === u.hrEmp) || null;
  }
  function meGeo() {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve({ err: 'جهازك لا يدعم تحديد الموقع' });
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy) }),
        err => resolve({ err: err.code === 1 ? 'لازم تسمح بالوصول للموقع عشان تسجل الحضور' : 'تعذّر تحديد موقعك — فعّل GPS وحاول مرة ثانية' }),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
    });
  }
  async function mePunch(kind) {
    const emp = meEmployee();
    if (!emp) { toast('لا يوجد ملف موظف مرتبط بحسابك', 'err'); return; }
    const btn = qs('#meBtnIn'), btn2 = qs('#meBtnOut');
    if (btn) { btn.disabled = true; }
    const msg = qs('#meMsg');
    if (msg) msg.textContent = 'جارٍ تحديد موقعك…';
    const geo = await meGeo();
    if (geo.err) { if (msg) msg.textContent = geo.err; toast(geo.err, 'err'); if (btn) btn.disabled = false; return; }
    if (msg) msg.textContent = 'تم تحديد الموقع (دقة ' + geo.acc + ' م) — جارٍ التحقق من الوجه…';

    const hasFace = !!emp.face;
    const hh = await sbAuthHeaders();
    const proceed = (score) => {
      fetch(SB_URL + '/rest/v1/rpc/hr_punch', {
        method: 'POST', headers: hh,
        body: JSON.stringify({ p_kind: kind, p_lat: geo.lat, p_lng: geo.lng, p_acc: geo.acc, p_method: hasFace ? 'face' : 'location', p_score: score })
      }).then(async r => ({ ok: r.ok, j: await r.json().catch(() => ({})) })).then(async res => {
        if (!res.ok) {
          const m = res.j.message || 'تعذّر تسجيل الحضور';
          toast(m, 'err'); if (msg) msg.textContent = m; if (btn) btn.disabled = false;
          return;
        }
        const t = res.j.time || '';
        if (msg) msg.textContent = (kind === 'in' ? 'تم تسجيل حضورك ' : 'تم تسجيل انصرافك ') + t + ' — داخل النطاق (' + res.j.distance + ' م)';
        toast('تم التسجيل ✅ ' + t);
        try { const data = await sbLoad(); if (data) { db = data; ensureSettings(); } } catch (e) { }
        render();
        if (qs('#meMsg')) qs('#meMsg').textContent = (kind === 'in' ? 'تم تسجيل حضورك ' : 'تم تسجيل انصرافك ') + t + ' — داخل النطاق (' + res.j.distance + ' م)';
      }).catch(() => { toast('تعذّر الاتصال — تحقق من الشبكة', 'err'); if (btn) btn.disabled = false; });
    };

    if (hasFace) {
      faceModal(kind === 'in' ? 'تسجيل الحضور بالوجه' : 'تسجيل الانصراف بالوجه', 'لازم يكون وجهك مطابقًا للصورة المسجلة', 'verify', emp, async (desc) => {
        try {
          const r = await fetch(SB_URL + '/rest/v1/rpc/hr_face_check', {
            method: 'POST', headers: Object.assign({}, await sbAuthHeaders()),
            body: JSON.stringify({ p_desc: desc })
          });
          const j = await r.json().catch(() => ({}));
          if (!j || !j.ok) {
            toast(j && j.reason === 'no_face' ? 'لم يُسجَّل وجهك بعد — راجع الموارد البشرية' : 'الوجه غير مطابق — حاول مرة أخرى', 'err');
            if (btn) btn.disabled = false; return;
          }
          proceed(j.distance);
        } catch (e) { toast('تعذّر التحقق', 'err'); if (btn) btn.disabled = false; }
      });
    } else {
      if (kind === 'out' && btn2) btn2.disabled = true;
      proceed(null);
    }
  }

  VIEWS.me = function () {
    const u = currentUser();
    if (!u) return emptyState('سجّل الدخول', '');
    const emp = meEmployee();
    if (!emp) return emptyState('لا يوجد ملف موظف', 'تواصل مع الموارد البشرية لربط حسابك');
    const today = hrDate();
    const rec = hrAttOf(emp.id, today);
    const st = hrAttStatus(rec);
    const b = branchById(emp.branchId);
    const month = hrEmpMonth(emp.id, today.slice(0, 7));
    return `<div class="me-wrap">
      <div class="card me-card">
        <div class="card-body" style="text-align:center">
          <div class="me-avatar">${esc((emp.name || '؟').trim().charAt(0))}</div>
          <h2 style="margin:8px 0 2px;font-size:19px">${esc(emp.name)}</h2>
          <div class="small muted">${esc(emp.job || '')} — ${esc((b || {}).name || '')}</div>
          <div style="margin-top:12px">${hrStatChip(st)} ${rec && rec.in ? `<span class="num">${rec.in}</span>` : ''}${rec && rec.out ? ` ← <span class="num">${rec.out}</span>` : ''}</div>
          ${rec && rec.method === 'face' ? '<div class="tiny muted" style="margin-top:6px">تم التحقق بالوجه</div>' : ''}
        </div>
        <div class="card-body me-actions">
          <button class="btn btn-primary me-btn" id="meBtnIn" data-action="me-in" ${rec && rec.in ? 'disabled' : ''}>${icon('check', 18)} تسجيل الحضور</button>
          <button class="btn btn-outline me-btn" id="meBtnOut" data-action="me-out" ${!rec || !rec.in || rec.out ? 'disabled' : ''}>${icon('clock', 18)} تسجيل الانصراف</button>
          <div class="tiny muted" id="meMsg" style="margin-top:10px;min-height:18px"></div>
        </div>
      </div>
      <div class="card"><div class="card-head"><h3>ملخص الشهر</h3></div><div class="card-body">
        <div class="me-stats">
          <div><b>${month.attended}</b><span>حضور</span></div>
          <div><b>${month.late}</b><span>تأخير</span></div>
          <div><b>${month.absent}</b><span>غياب</span></div>
          <div><b>${month.leave}</b><span>إجازة</span></div>
        </div>
      </div></div>
      <div class="card" style="margin-top:14px"><div class="card-head"><h3>آخر سجلاتي</h3></div><div class="card-body" style="padding:0;overflow:auto">
        <table class="tbl"><thead><tr><th>التاريخ</th><th>حضور</th><th>انصراف</th><th>الحالة</th></tr></thead><tbody>
        ${hrData().attendance.filter(x => x.empId === emp.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map(r => `<tr><td class="num small">${r.date}</td><td class="num">${r.in || '—'}</td><td class="num">${r.out || '—'}</td><td>${hrStatChip(hrAttStatus(r))}</td></tr>`).join('') || '<tr><td colspan="4" class="muted small">لا توجد سجلات</td></tr>'}
        </tbody></table></div></div>
      <p class="tiny muted" style="text-align:center;margin-top:14px">التسجيل يعمل فقط داخل نطاق الفرع وبعد التحقق من الوجه</p>
    </div>`;
  };

  async function hrMakeLogin(empId) {
    const emp = hrEmp(empId); if (!emp) return;
    openModal(`<div class="modal-head"><div><h2>حساب الموظف — ${esc(emp.name)}</h2><p class="small muted">يدخل منه الموظف من جواله ويسجل الحضور</p></div></div>
      <div class="modal-body">
        <div class="field"><label>اسم الدخول</label><input class="input num" id="hl_user" dir="ltr" value="${esc(emp.username || ('emp.' + emp.id))}"></div>
        <div class="field"><label>كلمة المرور / الرمز (4 أرقام على الأقل)</label><input class="input num" id="hl_pass" dir="ltr" value="${esc(emp.mobile ? emp.mobile.slice(-4) : '')}"></div>
        <p class="tiny muted" style="margin-top:8px">لن يظهر الموظف أي بيانات غير ملفه وحضوره.</p>
      </div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="hr-mk-login-save" data-id="${emp.id}">إنشاء / تحديث الحساب</button></div>`, { size: 'sm' });
  }

  async function hrMakeLoginSave(empId) {
    const un = ((qs('#hl_user') || {}).value || '').trim().toLowerCase();
    const pw = (qs('#hl_pass') || {}).value || '';
    if (un.length < 3 || pw.length < 4) { toast('اسم الدخول 3 أحرف وكلمة المرور 4 على الأقل', 'err'); return; }
    try {
      const r = await fetch(SB_URL + '/rest/v1/rpc/hr_make_login', {
        method: 'POST', headers: Object.assign({}, await sbAuthHeaders()),
        body: JSON.stringify({ p_emp: empId, p_password: pw })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { toast(j.message || 'تعذّر إنشاء الحساب', 'err'); return; }
      const emp = hrEmp(empId); if (emp) emp.username = j.username;
      try { const data = await sbLoad(); if (data) { db = data; ensureSettings(); } } catch (e) { }
      save(); closeModal();
      toast('الحساب جاهز — اسم الدخول ' + j.username);
      render();
      askConfirm('اسم الدخول: ' + j.username + ' — كلمة المرور: ' + pw + '. احفظها وسلّمها للموظف. هل نسختها؟', () => { });
    } catch (e) { toast('تعذّر الاتصال', 'err'); }
  }


  /* ---------- طباعة تقارير HR ---------- */
  function hrPrintFrame() {
    return `<style>
      @page{size:A4;margin:14mm}
      *{box-sizing:border-box}
      body{font-family:Tahoma,Arial,sans-serif;color:#222;margin:0;font-size:12px}
      .ph{display:flex;align-items:center;gap:14px;border-bottom:2px solid #7A5C2E;padding-bottom:10px;margin-bottom:14px}
      .ph img{height:58px;object-fit:contain}
      .ph h1{font-size:17px;margin:0}
      .ph .m{font-size:11px;color:#666}
      h2.t{font-size:15px;margin:0 0 10px;color:#5d4416}
      table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:11px}
      th,td{border:1px solid #bbb;padding:5px 6px;text-align:right}
      th{background:#f2ecdf;font-weight:700}
      tfoot td{background:#faf7ef;font-weight:700}
      .meta{display:flex;justify-content:space-between;font-size:11px;color:#555;margin-bottom:8px}
      .signs{display:flex;justify-content:space-between;margin-top:34px;font-size:11px}
      .signs div{width:30%;border-top:1px solid #999;padding-top:6px;text-align:center}
      .note{font-size:10.5px;color:#666;margin-top:10px}
      .kv{width:100%;border-collapse:collapse}
      .kv th{width:26%}
      .badge{display:inline-block;padding:1px 6px;border:1px solid #999;border-radius:8px;font-size:10px}
      .art{margin-bottom:9px}
      .art b{color:#5d4416}
      @media print{.noprint{display:none}}
    </style>`;
  }
  function hrPrintDoc(title, subtitle, bodyHtml, opts) {
    const s = S();
    const o = opts || {};
    const dz = new Date().toLocaleDateString('ar-SA-u-nu-latn');
    const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${esc(title)}</title>${hrPrintFrame()}</head><body>
      <div class="ph"><img src="${esc(/^https?:|^data:/.test(s.logo || '') ? s.logo : (location.origin + location.pathname.replace(/[^/]*$/, '') + (s.logo || 'assets/brand/snam-logo-gold.png')))}" alt="">
        <div style="flex:1"><h1>${esc(s.companyName || 'شركة سنام الرائدة')}</h1>
        <div class="m">${esc(s.tagline || 'المشغّلة لمطاعم حاشي باشا')} — ${esc(s.serviceName || 'نظام الجودة')}</div></div>
        <div class="m" style="text-align:left">${esc(dz)}<br>${o.region ? esc(o.region) : 'المنطقة الجنوبية'}</div></div>
      <h2 class="t">${esc(title)}</h2>
      ${subtitle ? `<div class="meta"><span>${esc(subtitle)}</span><span>${o.count != null ? 'العدد: ' + o.count : ''}</span></div>` : ''}
      ${bodyHtml}
      ${o.signs === false ? '' : `<div class="signs">
        <div>الموارد البشرية<br>${esc((currentUser() || {}).name || '')}</div>
        <div>مدير التشغيل</div>
        <div>المدير التنفيذي<br>${esc(s.ceoName || '')}</div></div>`}
      <div class="note">صدر من ${esc(s.companyName || 'شركة سنام')} — ${esc(dz)}</div>
      </body></html>`;
    const w = window.open('', '_blank');
    if (!w) { toast('اسمح بالنوافذ المنبثقة لطباعة التقرير', 'err'); return; }
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(() => { try { w.focus(); w.print(); } catch (e) { } }, 600);
  }

  function hrPrint(kind) {
    const d = hrData();
    const emps = hrEmployees();
    const month = ui.hrMonth || new Date().toISOString().slice(0, 7);
    if (kind === 'emp') {
      const rows = emps.map((e, i) => `<tr><td>${i + 1}</td><td>${esc(e.name)}</td><td>${esc(e.no || '')}</td><td>${esc(e.job || '')}</td>
        <td>${esc((branchById(e.branchId) || {}).name || '')}</td><td>${esc(e.mobile || '')}</td><td>${esc(e.hireDate || '')}</td>
        ${hrSeesPay() ? `<td>${hrMoney(hrNet(e))}</td>` : ''}<td>${e.status === 'left' ? 'منتهي' : 'على رأس العمل'}</td></tr>`).join('');
      hrPrintDoc('كشف الموظفين', 'جميع الموظفين — ' + emps.length + ' موظف', `<table><thead><tr><th>#</th><th>الاسم</th><th>الرقم الوظيفي</th><th>الوظيفة</th><th>الفرع</th><th>الجوال</th><th>التعيين</th>${hrSeesPay() ? '<th>الراتب</th>' : ''}<th>الحالة</th></tr></thead><tbody>${rows || '<tr><td colspan="9">لا يوجد</td></tr>'}</tbody></table>`, { count: emps.length });
      return;
    }
    if (kind === 'att') {
      const date = ui.hrDate || hrDate();
      const rows = emps.map(e => { const s = hrEmpMonth(e.id, month); return `<tr><td>${esc(e.name)}</td><td>${esc((branchById(e.branchId) || {}).name || '')}</td>
        <td>${s.attended}</td><td>${s.late}</td><td>${s.absent}</td><td>${s.leave}</td><td>${s.lateMins}</td></tr>`; }).join('');
      hrPrintDoc('كشف الحضور والانصراف', 'شهر ' + month, `<table><thead><tr><th>الموظف</th><th>الفرع</th><th>أيام الحضور</th><th>التأخير</th><th>الغياب</th><th>الإجازات</th><th>دقائق التأخير</th></tr></thead><tbody>${rows}</tbody></table>`);
      return;
    }
    if (kind === 'req') {
      const rows = d.requests.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(r => `<tr><td>${esc((hrEmp(r.empId) || {}).name || '')}</td><td>${esc(r.type)}</td>
        <td>${esc(r.from || '')}</td><td>${esc(r.to || '')}</td><td>${r.days || ''}</td><td>${r.amount ? hrMoney(r.amount) : ''}</td>
        <td>${r.status === 'approved' ? 'معتمد' : r.status === 'rejected' ? 'مرفوض' : 'معلق'}</td></tr>`).join('');
      hrPrintDoc('كشف الطلبات والإجازات', 'كل الطلبات', `<table><thead><tr><th>الموظف</th><th>النوع</th><th>من</th><th>إلى</th><th>الأيام</th><th>المبلغ</th><th>الحالة</th></tr></thead><tbody>${rows || '<tr><td colspan="7">لا يوجد</td></tr>'}</tbody></table>`, { count: d.requests.length });
      return;
    }
    if (kind === 'pay') {
      const rows = d.payroll.filter(p => p.month === month);
      const body = rows.map(p => { const e = hrEmp(p.empId) || {}; return `<tr><td>${esc(e.name || '')}</td><td>${esc((branchById(p.branchId) || {}).name || '')}</td>
        <td>${hrMoney(p.basic)}</td><td>${hrMoney((p.housing || 0) + (p.transport || 0) + (p.other || 0))}</td><td>${hrMoney(p.reward)}</td>
        <td>${p.absenceDays || 0}</td><td>${hrMoney(p.deductions)}</td><td>${hrMoney(p.net)}</td></tr>`; }).join('');
      const tot = rows.reduce((t, p) => ({ n: t.n + (Number(p.net) || 0), r: t.r + (Number(p.reward) || 0), d: t.d + (Number(p.deductions) || 0) }), { n: 0, r: 0, d: 0 });
      hrPrintDoc('مسير الرواتب', 'شهر ' + month, `<table><thead><tr><th>الموظف</th><th>الفرع</th><th>الأساسي</th><th>البدلات</th><th>مكافأة</th><th>أيام غياب</th><th>الخصومات</th><th>الصافي</th></tr></thead>
        <tbody>${body || '<tr><td colspan="8">لا يوجد مسير</td></tr>'}</tbody>
        <tfoot><tr><td colspan="4">الإجمالي</td><td>${hrMoney(tot.r)}</td><td></td><td>${hrMoney(tot.d)}</td><td>${hrMoney(tot.n)}</td></tr></tfoot></table>`, { count: rows.length });
      return;
    }
    if (kind === 'rw') {
      const rows = d.rewards.filter(r => r.month === month).map(r => { const e = hrEmp(r.empId) || {}; return `<tr><td>${esc(e.name || '')}</td><td>${esc((branchById(r.branchId) || {}).name || '')}</td>
        <td>${r.avg != null ? r.avg + '%' : ''}</td><td>${hrMoney(r.amount)}</td><td>${r.status === 'approved' ? 'معتمدة' : 'مسودة'}</td></tr>`; }).join('');
      hrPrintDoc('كشف مكافآت المتميزين', 'شهر ' + month, `<table><thead><tr><th>الموظف</th><th>الفرع</th><th>تقييم الفرع</th><th>المكافأة</th><th>الحالة</th></tr></thead><tbody>${rows || '<tr><td colspan="5">لا توجد مكافآت</td></tr>'}</tbody></table>`);
      return;
    }
    if (kind === 'policy') {
      const p = d.policy;
      const body = (p.articles || []).map(a => `<div class="art"><b>${a.no}. ${esc(a.title)}</b><div>${esc(a.text)}</div></div>`).join('');
      hrPrintDoc(p.title || 'لائحة العمل الداخلية', 'إصدار ' + (p.version || '1.0') + ' — سارية من ' + fmtDate(p.date || ''), body, { signs: true });
      return;
    }
    if (kind === 'card') {
      const id = ui.hrCard; const e = hrEmp(id); if (!e) return;
      const s = hrEmpMonth(e.id, month);
      hrPrintDoc('بطاقة موظف', e.name, `<table class="kv">
        <tr><th>الاسم</th><td>${esc(e.name)}</td><th>الرقم الوظيفي</th><td>${esc(e.no || '—')}</td></tr>
        <tr><th>الوظيفة</th><td>${esc(e.job || '—')}</td><th>القسم</th><td>${esc(e.dept || '—')}</td></tr>
        <tr><th>الفرع</th><td>${esc((branchById(e.branchId) || {}).name || '—')}</td><th>الجوال</th><td>${esc(e.mobile || '—')}</td></tr>
        <tr><th>تاريخ التعيين</th><td>${esc(e.hireDate || '—')}</td><th>نهاية العقد</th><td>${esc(e.contractEnd || '—')}</td></tr>
        ${hrSeesPay() ? `<tr><th>الراتب الأساسي</th><td>${hrMoney(e.basic)}</td><th>إجمالي الراتب</th><td>${hrMoney(hrNet(e))}</td></tr>` : ''}
        <tr><th>حضور الشهر</th><td>${s.attended}</td><th>تأخير / غياب</th><td>${s.late} / ${s.absent}</td></tr>
      </table>`, { region: (regionById((branchById(e.branchId) || {}).regionId) || {}).name });
      return;
    }
  }


  /* ==================== نظام الجرد المتكامل ==================== */
  const INV_TYPES = {
    daily: { key: 'daily', name: 'جرد يومي', short: 'يومي', prefix: 'INV-D', color: '#3E7C59' },
    half: { key: 'half', name: 'جرد نصف سنوي', short: 'نصف سنوي', prefix: 'INV-H', color: '#7A5C2E' },
    year: { key: 'year', name: 'جرد سنوي', short: 'سنوي', prefix: 'INV-Y', color: '#4A5B7A' },
    surprise: { key: 'surprise', name: 'جرد مفاجئ', short: 'مفاجئ', prefix: 'INV-S', color: '#8B3A3A' }
  };
  function invData() {
    if (!db.inv || typeof db.inv !== 'object') db.inv = {};
    if (!Array.isArray(db.inv.items)) db.inv.items = [];
    if (!Array.isArray(db.inv.sessions)) db.inv.sessions = [];
    if (!db.inv.settings) db.inv.settings = { lowVariance: 2 };
    return db.inv;
  }
  const invType = k => INV_TYPES[k] || INV_TYPES.daily;
  const invItem = id => invData().items.find(x => x.id === id) || null;
  const invSession = id => invData().sessions.find(x => x.id === id) || null;
  function canSeeInvSys() { return ['admin', 'quality_manager', 'ops_manager', 'general_manager', 'general_supervisor', 'ceo', 'hr', 'branch_manager'].includes(hrRole()); }
  const invCanCreate = () => ['admin', 'quality_manager', 'ops_manager'].includes(hrRole());
  const invCanApprove = () => ['admin', 'quality_manager', 'ops_manager', 'ceo', 'general_manager'].includes(hrRole());
  function invScopeBranch(id) {
    const reg = hrScopeRegion();
    if (!reg) return true;
    const b = branchById(id);
    return !!b && b.regionId === reg;
  }
  const invSessions = () => invData().sessions.filter(s => invScopeBranch(s.branchId));
  function invNextNo(type) {
    const pre = invType(type).prefix;
    const list = invData().sessions.filter(s => s.type === type);
    let n = 1;
    list.forEach(s => { const m = String(s.no || '').match(/(\d+)$/); if (m) n = Math.max(n, Number(m[1]) + 1); });
    return pre + '-' + String(n).padStart(4, '0');
  }
  function invTotals(s) {
    let sys = 0, cnt = 0, val = 0, lines = 0;
    (s.lines || []).forEach(l => {
      if (l.count == null || l.count === '') return;
      lines++;
      sys += Number(l.sys) || 0; cnt += Number(l.count) || 0;
      val += ((Number(l.count) || 0) - (Number(l.sys) || 0)) * (Number(l.price) || 0);
    });
    const diffQty = cnt - sys;
    const pct = sys ? Math.round((diffQty / sys) * 1000) / 10 : 0;
    return { sys, cnt, diffQty, value: Math.round(val * 100) / 100, pct, lines };
  }
  function invLinesFor(branchId, type) {
    const items = invData().items.filter(i => i.active !== false && (!i.branchId || i.branchId === branchId));
    return items.map(i => ({ itemId: i.id, name: i.name, unit: i.unit, price: i.price, sys: null, count: null }));
  }
  function invStart(type) {
    const br = (ui.invBranch && branchById(ui.invBranch)) || hrBranches()[0];
    if (!br) { toast('لا توجد فروع', 'err'); return; }
    const s = {
      id: 'IS-' + Date.now().toString(36).toUpperCase(), no: invNextNo(type), type,
      date: hrDate(), branchId: br.id, regionId: br.regionId, status: 'draft',
      lines: invLinesFor(br.id, type), notes: '', createdBy: (currentUser() || {}).username,
      createdAt: new Date().toISOString()
    };
    if (!s.lines.length) { toast('أضف أصناف الجرد أولًا', 'err'); return; }
    ui.invSess = s; ui.route = 'inv-session';
    try { history.replaceState(null, '', '#/inv-session/' + s.id); } catch (e) { }
    render();
  }
  function invSessSave() {
    const s = ui.invSess; if (!s) return;
    const d = invData();
    const i = d.sessions.findIndex(x => x.id === s.id);
    s.updatedAt = new Date().toISOString();
    if (i >= 0) d.sessions[i] = s; else d.sessions.push(s);
    save(); toast('تم حفظ الجرد'); render();
  }

  VIEWS['inv-items'] = function () {
    const items = invData().items;
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn btn-primary btn-sm" data-action="inv-item-new">${icon('plus', 15)} صنف جديد</button>
        <span style="flex:1"></span>
        <span class="small muted">${items.length} صنف</span>
      </div>
      <div class="card"><div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الكود</th><th>الصنف</th><th>الوحدة</th><th>السعر</th><th>التصنيف</th><th>الفرع</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${items.length ? items.map(i => `<tr>
          <td class="num small">${esc(i.code || '—')}</td><td class="strong">${esc(i.name)}</td><td class="small">${esc(i.unit || '')}</td>
          <td class="num">${hrMoney(i.price)}</td><td class="small">${esc(i.cat || '')}</td>
          <td class="small">${i.branchId ? esc((branchById(i.branchId) || {}).name || '') : 'كل الفروع'}</td>
          <td>${i.active === false ? '<span class="chip chip-bad">موقوف</span>' : '<span class="chip chip-ok">نشط</span>'}</td>
          <td style="white-space:nowrap"><button class="btn btn-outline btn-sm" data-action="inv-item-edit" data-id="${i.id}">تعديل</button>
          <button class="btn btn-outline btn-sm" data-action="inv-item-del" data-id="${i.id}">${icon('trash', 13)}</button></td>
        </tr>`).join('') : '<tr><td colspan="8" class="muted small" style="padding:22px">لا توجد أصناف — أضف أصناف الجرد (لحوم، دجاج، خضار، مشروبات…)</td></tr>'}
      </tbody></table></div></div>`;
  };

  function invItemForm(id) {
    const it = id ? invItem(id) : { id: '', code: '', name: '', unit: 'كجم', price: 0, cat: '', branchId: '', active: true };
    const brs = `<option value="">كل الفروع</option>` + hrBranches().map(b => `<option value="${b.id}" ${it.branchId === b.id ? 'selected' : ''}>${esc(b.name)}</option>`).join('');
    openModal(`<div class="modal-head"><div><h2>${id ? 'تعديل صنف' : 'صنف جديد'}</h2><p class="small muted">بيانات الصنف وسعره لحساب قيمة الفرق</p></div></div>
      <div class="modal-body"><div class="form-grid">
        <div class="field"><label>الكود</label><input class="input num" id="ii_code" dir="ltr" value="${esc(it.code || '')}"></div>
        <div class="field"><label>اسم الصنف *</label><input class="input" id="ii_name" value="${esc(it.name || '')}"></div>
        <div class="field"><label>الوحدة</label><select class="input" id="ii_unit">${['كجم', 'جرام', 'لتر', 'علبة', 'كرتون', 'حبة', 'كيس'].map(u => `<option ${it.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div>
        <div class="field"><label>سعر الوحدة (ر.س)</label><input class="input num" type="number" step="0.01" id="ii_price" value="${Number(it.price) || 0}"></div>
        <div class="field"><label>التصنيف</label><input class="input" id="ii_cat" value="${esc(it.cat || '')}" placeholder="لحوم / خضار / مشروبات"></div>
        <div class="field"><label>الفرع</label><select class="input" id="ii_branch">${brs}</select></div>
        <div class="field"><label>الحالة</label><select class="input" id="ii_active">
          <option value="1" ${it.active !== false ? 'selected' : ''}>نشط</option>
          <option value="0" ${it.active === false ? 'selected' : ''}>موقوف</option></select></div>
      </div></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="inv-item-save" data-id="${it.id}">حفظ الصنف</button></div>`, { size: 'lg' });
  }

  VIEWS.invsys = function () {
    const list = invSessions();
    const card = (t, v, sub, cls) => `<div class="card hr-kpi ${cls || ''}"><div class="card-body"><div class="tiny muted">${t}</div><div class="hr-kpi-val">${v}</div><div class="tiny muted">${sub || ''}</div></div></div>`;
    const byType = k => list.filter(s => s.type === k);
    const month = new Date().toISOString().slice(0, 7);
    const mon = list.filter(s => (s.date || '').slice(0, 7) === month);
    const loss = mon.reduce((t, s) => t + Math.min(0, invTotals(s).value), 0);
    return `<div class="grid-4" style="margin-bottom:16px">
        ${card('جرد اليوم', byType('daily').filter(s => s.date === hrDate()).length, 'يومي', 'ok')}
        ${card('جرد نصف سنوي', byType('half').length, 'هذا العام')}
        ${card('جرد سنوي', byType('year').length, 'هذا العام')}
        ${card('جرد مفاجئ', byType('surprise').length, 'غير مجدول')}
        ${card('قيمة الفاقد هذا الشهر', hrMoney(Math.abs(loss)) + ' ر.س', mon.length + ' جرد', loss ? 'bad' : 'ok')}
      </div>
      <div class="card" style="margin-bottom:14px"><div class="card-head"><h3>بدء جرد جديد</h3></div><div class="card-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <select class="input" id="invNewBranch" style="max-width:220px">${hrBranches().map(b => `<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select>
          <button class="btn btn-primary btn-sm" data-action="inv-start" data-kind="daily">${icon('calendar', 14)} جرد يومي</button>
          <button class="btn btn-outline btn-sm" data-action="inv-start" data-kind="half">جرد نصف سنوي</button>
          <button class="btn btn-outline btn-sm" data-action="inv-start" data-kind="year">جرد سنوي</button>
          <button class="btn btn-outline btn-sm" data-action="inv-start" data-kind="surprise">جرد مفاجئ</button>
        </div>
      </div></div>
      <div class="card"><div class="card-head"><h3>آخر عمليات الجرد</h3><div class="spacer"></div><a class="btn btn-outline btn-sm" href="#/inv-sessions">الكل</a></div>
        <div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الرقم</th><th>النوع</th><th>الفرع</th><th>التاريخ</th><th>قيمة الفرق</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8).map(s => `<tr>
          <td class="num small">${esc(s.no)}</td><td>${invType(s.type).short}</td><td class="small">${esc((branchById(s.branchId) || {}).name || '')}</td>
          <td class="num small">${s.date}</td><td class="num" style="color:${invTotals(s).value < 0 ? 'var(--bad)' : 'inherit'}">${hrMoney(invTotals(s).value)}</td>
          <td><span class="chip ${s.status === 'approved' ? 'chip-ok' : s.status === 'done' ? 'chip-gold' : 'chip-warn'}">${s.status === 'approved' ? 'معتمد' : s.status === 'done' ? 'منتهي' : 'مسودة'}</span></td>
          <td><a class="btn btn-outline btn-sm" href="#/inv-session/${s.id}">فتح</a></td></tr>`).join('') || '<tr><td colspan="7" class="muted small" style="padding:20px">لا يوجد جرد بعد</td></tr>'}
        </tbody></table></div></div>`;
  };

  VIEWS['inv-sessions'] = function () {
    const type = ui.invFilterType || 'all';
    let list = invSessions();
    if (type !== 'all') list = list.filter(s => s.type === type);
    if (ui.invFrom) list = list.filter(s => s.date >= ui.invFrom);
    if (ui.invTo) list = list.filter(s => s.date <= ui.invTo);
    return `<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px">
        <select class="input" id="invFType" style="max-width:170px">
          ${[['all', 'كل الأنواع'], ['daily', 'يومي'], ['half', 'نصف سنوي'], ['year', 'سنوي'], ['surprise', 'مفاجئ']].map(([k, t]) => `<option value="${k}" ${type === k ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <input class="input" type="date" id="invFFrom" value="${ui.invFrom || ''}" style="max-width:160px">
        <input class="input" type="date" id="invFTo" value="${ui.invTo || ''}" style="max-width:160px">
        <button class="btn btn-outline btn-sm" data-action="inv-filter">تصفية</button>
        <span style="flex:1"></span>
        <button class="btn btn-outline btn-sm" data-action="inv-print-list">${icon('print', 14)} طباعة الكشف</button>
      </div>
      <div class="card"><div class="card-body" style="padding:0;overflow:auto"><table class="tbl">
        <thead><tr><th>الرقم</th><th>النوع</th><th>الفرع</th><th>التاريخ</th><th>الأصناف</th><th>الفرق</th><th>قيمة الفرق</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(s => { const t = invTotals(s); return `<tr>
          <td class="num small">${esc(s.no)}</td><td>${invType(s.type).short}</td><td class="small">${esc((branchById(s.branchId) || {}).name || '')}</td>
          <td class="num small">${s.date}</td><td class="num">${t.lines}</td><td class="num">${t.diffQty}</td>
          <td class="num" style="color:${t.value < 0 ? 'var(--bad)' : 'inherit'}">${hrMoney(t.value)}</td>
          <td><span class="chip ${s.status === 'approved' ? 'chip-ok' : s.status === 'done' ? 'chip-gold' : 'chip-warn'}">${s.status === 'approved' ? 'معتمد' : s.status === 'done' ? 'منتهي' : 'مسودة'}</span></td>
          <td><a class="btn btn-outline btn-sm" href="#/inv-session/${s.id}">فتح</a></td></tr>`; }).join('') || '<tr><td colspan="9" class="muted small" style="padding:20px">لا توجد عمليات جرد</td></tr>'}
      </tbody></table></div></div>`;
  };

  VIEWS['inv-session'] = function () {
    const id = (location.hash.split('/')[2] || '').split('?')[0];
    let s = invSession(id) || ui.invSess;
    if (!s) return emptyState('عملية الجرد غير موجودة', '');
    ui.invSess = s;
    const t = invTotals(s);
    const b = branchById(s.branchId) || {};
    const readOnly = s.status !== 'draft';
    const rows = (s.lines || []).map((l, i) => {
      const diff = (l.count === '' || l.count == null) ? null : (Number(l.count) - (Number(l.sys) || 0));
      const val = diff == null ? null : diff * (Number(l.price) || 0);
      return `<tr>
        <td class="num small">${i + 1}</td><td class="small">${esc(l.name)}</td><td class="tiny muted">${esc(l.unit || '')}</td>
        <td class="num">${hrMoney(l.price)}</td>
        <td>${readOnly ? `<span class="num">${l.sys == null ? '—' : l.sys}</span>` : `<input class="input num inv-in" data-inv="sys" data-id="${l.itemId}" type="number" step="0.01" value="${l.sys == null ? '' : l.sys}">`}</td>
        <td>${readOnly ? `<span class="num">${l.count == null ? '—' : l.count}</span>` : `<input class="input num inv-in" data-inv="count" data-id="${l.itemId}" type="number" step="0.01" value="${l.count == null ? '' : l.count}">`}</td>
        <td class="num" data-diff="${l.itemId}" style="color:${diff != null && diff < 0 ? 'var(--bad)' : diff > 0 ? 'var(--ok)' : 'inherit'}">${diff == null ? '—' : diff}</td>
        <td class="num" data-val="${l.itemId}" style="color:${val != null && val < 0 ? 'var(--bad)' : 'inherit'}">${val == null ? '—' : hrMoney(val)}</td>
      </tr>`;
    }).join('');
    return `<div class="card" style="margin-bottom:14px"><div class="card-head">
        <div><h3>${esc(s.no)} — ${invType(s.type).name}</h3>
        <div class="tiny muted">${esc(b.name || '')} · ${s.date} · ${esc(s.createdBy || '')}</div></div>
        <div class="spacer"></div>
        <span class="chip ${s.status === 'approved' ? 'chip-ok' : s.status === 'done' ? 'chip-gold' : 'chip-warn'}">${s.status === 'approved' ? 'معتمد' : s.status === 'done' ? 'منتهي' : 'مسودة'}</span>
      </div>
      <div class="card-body">
        <div class="me-stats" style="grid-template-columns:repeat(4,1fr);margin-bottom:14px">
          <div><b>${t.lines}</b><span>أصناف مجرودة</span></div>
          <div><b>${t.diffQty}</b><span>فرق الكمية</span></div>
          <div><b>${hrMoney(t.value)}</b><span>قيمة الفرق</span></div>
          <div><b>${t.pct}%</b><span>نسبة الفرق</span></div>
        </div>
        <div style="overflow:auto"><table class="tbl" id="invTable"><thead><tr><th>#</th><th>الصنف</th><th>الوحدة</th><th>السعر</th><th>كمية النظام</th><th>الكمية الفعلية</th><th>الفرق</th><th>قيمة الفرق</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="8" class="muted small">لا توجد أصناف</td></tr>'}</tbody></table></div>
        <div class="field" style="margin-top:12px"><label>ملاحظات الجرد</label>
          <textarea class="input" id="invNotes" rows="2" ${readOnly ? 'readonly' : ''}>${esc(s.notes || '')}</textarea></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
          ${!readOnly ? `<button class="btn btn-primary btn-sm" data-action="inv-save" data-id="${s.id}">${icon('check', 14)} حفظ</button>
          <button class="btn btn-outline btn-sm" data-action="inv-done" data-id="${s.id}">إنهاء الجرد</button>` : ''}
          <button class="btn btn-outline btn-sm" data-action="inv-print" data-id="${s.id}">${icon('print', 14)} طباعة</button>
          ${s.status === 'done' && invCanApprove() ? `<button class="btn btn-primary btn-sm" data-action="inv-approve" data-id="${s.id}">اعتماد</button>` : ''}
        </div>
      </div></div>`;
  };

  function invPrintSess(id) {
    const s = invSession(id) || ui.invSess; if (!s) return;
    const t = invTotals(s), b = branchById(s.branchId) || {};
    const rows = (s.lines || []).filter(l => l.count != null && l.count !== '').map((l, i) => {
      const d = Number(l.count) - (Number(l.sys) || 0);
      return `<tr><td>${i + 1}</td><td>${esc(l.name)}</td><td>${esc(l.unit || '')}</td><td>${hrMoney(l.price)}</td>
        <td>${l.sys == null ? '' : l.sys}</td><td>${l.count}</td><td>${d}</td><td>${hrMoney(d * (Number(l.price) || 0))}</td></tr>`;
    }).join('');
    hrPrintDoc(invType(s.type).name + ' — ' + s.no, (b.name || '') + ' · ' + s.date, `
      <table><thead><tr><th>#</th><th>الصنف</th><th>الوحدة</th><th>السعر</th><th>كمية النظام</th><th>الكمية الفعلية</th><th>الفرق</th><th>قيمة الفرق</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="8">لا توجد بنود</td></tr>'}</tbody>
      <tfoot><tr><td colspan="4">الإجمالي</td><td>${t.sys}</td><td>${t.cnt}</td><td>${t.diffQty}</td><td>${hrMoney(t.value)}</td></tr></tfoot></table>
      ${s.notes ? `<p class="note">ملاحظات: ${esc(s.notes)}</p>` : ''}`, { region: (regionById(s.regionId) || {}).name, count: t.lines });
  }


  /* ==================== الصلاحيات التفصيلية ==================== */
  const PERM_MODULES = [
    ['visits', 'زيارات الفروع'], ['bmvisits', 'تقييم مدراء الفروع'], ['invvisits', 'زيارات الجرد'],
    ['invsys', 'نظام الجرد'], ['branches', 'المناطق والفروع'], ['findings', 'الملاحظات والتصحيح'],
    ['forms', 'الاستمارات'], ['reports', 'التقارير'], ['analysis', 'تحليل التقارير'], ['kpi', 'تقييم مدير المنطقة'],
    ['hr', 'الموارد البشرية'], ['hrpay', 'رواتب HR'], ['ads', 'الإعلانات'], ['users', 'المستخدمون'], ['settings', 'إعدادات الموقع']
  ];
  const PERM_ACTS = [['view', 'عرض'], ['add', 'إضافة'], ['edit', 'تعديل'], ['toggle', 'إيقاف/تفعيل'], ['delete', 'حذف'], ['approve', 'اعتماد']];
  const permModLabel = m => (PERM_MODULES.find(x => x[0] === m) || [m, m])[1];
  function permOf(u, mod, act) {
    if (!u) return false;
    if (u.role === 'admin') return true;
    if (!u.perms || !u.perms[mod]) return true;      /* بلا تخصيص = حسب الدور كما كان */
    return !!u.perms[mod][act];
  }
  const myPerm = (mod, act) => permOf(currentUser(), mod, act);
  function permDenied(act, mod) {
    const u = currentUser(); if (!u) return false;
    if (u.role === 'admin') return false;
    const m = mod || permModuleOfAction(act);
    if (!m) return false;
    const kind = permKindOfAction(act);
    if (!kind) return false;
    return !permOf(u, m, kind);
  }
  function permModuleOfAction(act) {
    const map = {
      'add-user': 'users', 'edit-user': 'users', 'delete-user': 'users', 'toggle-user': 'users', 'user-perms': 'users',
      'save-settings': 'settings', 'save-maintenance': 'settings', 'save-feature': 'settings', 'delete-feature': 'settings',
      'add-ad': 'ads', 'save-ad': 'ads', 'delete-ad': 'ads',
      'add-city': 'branches', 'save-city': 'branches', 'edit-city': 'branches', 'delete-city': 'branches', 'toggle-city-active': 'branches',
      'add-branch': 'branches', 'save-branch': 'branches', 'edit-branch': 'branches', 'delete-branch': 'branches',
      'add-section': 'forms', 'add-item': 'forms', 'toggle-item': 'forms', 'edit-item': 'forms', 'delete-item': 'forms', 'delete-section': 'forms',
      'new-visit': 'visits', 'save-visit': 'visits', 'edit-audit': 'visits', 'delete-audit': 'visits', 'send-ops': 'visits',
      'ops-approve': 'visits', 'region-approve': 'visits', 'final-approve': 'visits', 'seal-approve': 'visits',
      'inv-item-new': 'invsys', 'inv-item-edit': 'invsys', 'inv-item-save': 'invsys', 'inv-item-del': 'invsys',
      'inv-start': 'invsys', 'inv-save': 'invsys', 'inv-done': 'invsys', 'inv-approve': 'invsys',
      'hr-new-emp': 'hr', 'hr-save-emp': 'hr', 'hr-del-emp': 'hr', 'hr-edit-emp': 'hr',
      'hr-att-edit': 'hr', 'hr-att-save': 'hr', 'hr-policy-edit': 'hr', 'hr-policy-save': 'hr',
      'hr-settings-save': 'hr', 'hr-face-enroll': 'hr', 'hr-mk-login': 'hr', 'hr-mk-login-save': 'hr',
      'hr-gen-pay': 'hrpay', 'hr-pay-edit': 'hrpay', 'hr-pay-save': 'hrpay', 'hr-rw-gen': 'hrpay', 'hr-rw-ok': 'hrpay',
      'save-finding': 'findings', 'close-finding': 'findings',
      'up-save': 'users', 'up-toggle': 'users', 'up-delete': 'users', 'up-reset': 'users', 'user-perms': 'users', 'perm-none': 'users'
    };
    return map[act] || null;
  }
  function permKindOfAction(act) {
    if (/^(up-|user-perms|add-user|edit-user|delete-user|toggle-user)/.test(act)) return 'edit';
    if (/(^|-)(new|add)$/.test(act) || /^inv-start$/.test(act) || /-new-emp$/.test(act) || /^hr-mk-login$/.test(act) || /-item-new$/.test(act)) return 'add';
    if (/(^|-)(delete|del)$/.test(act) || /-del-emp$/.test(act) || /-item-del$/.test(act) || /^delete-/.test(act)) return 'delete';
    if (/toggle|^perm-none$/.test(act)) return 'toggle';
    if (/approve|(^|-)ok$/.test(act)) return 'approve';
    if (/edit|save|(^|-)done$/.test(act)) return 'edit';
    return null;
  }

  function openUserProfile(id) {
    const u = db.users.find(x => x.id === id); if (!u) return;
    const perms = u.perms || {};
    const rows = PERM_MODULES.map(([m, label]) => `<tr>
      <td class="strong">${label}</td>
      ${PERM_ACTS.map(([a, al]) => `<td style="text-align:center"><input type="checkbox" class="perm-cb" data-mod="${m}" data-act="${a}" ${perms[m] ? (perms[m][a] ? 'checked' : '') : 'checked'} ${u.role === 'admin' ? 'disabled' : ''}></td>`).join('')}
      <td style="text-align:center"><button class="btn btn-outline btn-sm" data-action="perm-none" data-id="${u.id}" data-mod="${m}">حجب الكل</button></td>
    </tr>`).join('');
    openModal(`<div class="modal-head"><div><h2>${esc(u.name || u.username)}</h2>
        <p class="small muted">${esc(u.username)} · ${roleLabel(u.role)} · ${u.regionId === 'all' ? 'كل المناطق' : esc((regionById(u.regionId) || {}).name || '')}</p></div></div>
      <div class="modal-body">
        <div class="form-grid" style="margin-bottom:14px">
          <div class="field"><label>الاسم</label><input class="input" id="up_name" value="${esc(u.name || '')}"></div>
          <div class="field"><label>الدور</label><input class="input" value="${roleLabel(u.role)}" disabled></div>
          <div class="field"><label>الحالة</label><input class="input" value="${u.active === false ? 'موقوف' : 'مفعّل'}" disabled></div>
          <div class="field"><label>الجوال</label><input class="input num" id="up_phone" dir="ltr" value="${esc(u.phone || '')}"></div>
        </div>
        ${u.role === 'admin' ? '<p class="small muted">مدير المنصة يملك كل الصلاحيات دائمًا.</p>' : `
        <h3 class="rep-h">الصلاحيات</h3>
        <div style="overflow:auto"><table class="tbl perm-tbl"><thead><tr><th>القسم</th>${PERM_ACTS.map(([, l]) => `<th style="text-align:center">${l}</th>`).join('')}<th></th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="tiny muted" style="margin-top:8px">إلغاء «عرض» يخفي القسم من قائمته. التعديلات تُحفظ في السحابة فورًا.</p>`}
      </div>
      <div class="modal-foot" style="flex-wrap:wrap;gap:6px">
        <button class="btn btn-outline btn-sm" data-action="up-toggle" data-id="${u.id}">${u.active === false ? 'تفعيل الحساب' : 'إيقاف الحساب'}</button>
        <button class="btn btn-outline btn-sm" data-action="up-reset" data-id="${u.id}">إعادة كلمة المرور</button>
        <button class="btn btn-danger btn-sm" data-action="up-delete" data-id="${u.id}">حذف الحساب</button>
        <div class="spacer" style="flex:1"></div>
        <button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="up-save" data-id="${u.id}">${icon('check', 15)} حفظ</button>
      </div>`, { size: 'lg' });
  }

  function saveUserPerms(id) {
    const u = db.users.find(x => x.id === id); if (!u) return;
    const perms = {};
    document.querySelectorAll('.perm-cb').forEach(cb => {
      const m = cb.dataset.mod, a = cb.dataset.act;
      perms[m] = perms[m] || {};
      perms[m][a] = cb.checked;
    });
    u.perms = perms;
    const nm = (qs('#up_name') || {}).value; if (nm) u.name = nm.trim();
    u.phone = (qs('#up_phone') || {}).value || '';
    save(); closeModal(); toast('تم حفظ الصلاحيات'); render();
  }


  /* ---------- استعادة الزيارات المحذوفة من نسخ الجهاز ---------- */
  async function scanLocalBackups() {
    const found = new Map();
    const add = (arr, src, ts) => {
      (arr || []).forEach(a => {
        if (!a || !a.id) return;
        if (db.audits.some(x => x.id === a.id)) return;
        if (!found.has(a.id)) found.set(a.id, { audit: a, src, ts });
      });
    };
    try { add(db.audits, 'النسخة الحالية', Date.now()); } catch (e) { }
    try {
      const snaps = await BK.all();
      snaps.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      snaps.forEach(s => add((s.data || {}).audits, 'نسخة ' + new Date(s.ts).toLocaleString('ar-SA-u-nu-latn'), s.ts));
    } catch (e) { }
    try {
      Object.keys(localStorage).filter(k => k.startsWith('snam_qms')).forEach(k => {
        try { const d = JSON.parse(localStorage.getItem(k)); add(d.audits, 'ذاكرة ' + k, 0); } catch (e) { }
      });
    } catch (e) { }
    return [...found.values()].sort((a, b) => String(b.audit.date || '').localeCompare(String(a.audit.date || '')));
  }

  async function openRecover() {
    const list = await scanLocalBackups();
    if (!list.length) {
      openModal(`<div class="modal-head"><h3>لا توجد زيارات مفقودة على هذا الجهاز</h3></div>
        <div class="modal-body"><p class="small">لم أجد أي زيارة محفوظة محليًا وغير موجودة في السحابة. إن كانت الزيارات على جوال بندر، افتح هذه الشاشة من نفس الجوال.</p></div>
        <div class="modal-foot"><div class="spacer"></div><button class="btn btn-primary" data-action="close-modal">حسنًا</button></div>`, { size: 'sm' });
      return;
    }
    openModal(`<div class="modal-head"><div><h2>زيارات موجودة في نسخ الجهاز</h2><p class="small muted">${list.length} زيارة غير موجودة في السحابة</p></div></div>
      <div class="modal-body"><table class="tbl"><thead><tr><th></th><th>الرقم</th><th>النوع</th><th>الفرع</th><th>التاريخ</th><th>المصدر</th></tr></thead><tbody>
      ${list.map((x, i) => `<tr><td><input type="checkbox" class="rec-cb" data-id="${x.audit.id}" checked></td>
        <td class="num small">${esc(x.audit.id)}</td>
        <td>${x.audit.kind === 'inv' ? 'جرد' : x.audit.kind === 'bm' ? 'تقييم مدير' : typeName(x.audit.type)}</td>
        <td class="small">${esc((branchById(x.audit.branchId) || {}).name || '')}</td>
        <td class="num small">${esc(x.audit.date || '')}</td>
        <td class="tiny muted">${esc(x.src)}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="modal-foot"><div class="spacer"></div><button class="btn btn-outline" data-action="close-modal">إلغاء</button>
        <button class="btn btn-primary" data-action="rec-restore">استعادة المحدد</button></div>`, { size: 'lg' });
    window.__recList = list;
  }


  /* ---------- النسخ الاحتياطية السحابية ---------- */
  async function sbDailyBackup() {
    if (!sbSession) return;
    try {
      const h = await sbAuthHeaders(); if (!h) return;
      await fetch(SB_URL + '/rest/v1/rpc/daily_backup', { method: 'POST', headers: h, body: '{}' });
    } catch (e) { }
  }
  async function loadBackups() {
    const box = qs('#bkList'); if (!box) return;
    box.innerHTML = '<div class="small muted" style="padding:10px">جارٍ التحميل…</div>';
    try {
      const h = await sbAuthHeaders();
      const r = await fetch(SB_URL + '/rest/v1/rpc/list_backups', { method: 'POST', headers: h, body: '{}' });
      if (!r.ok) { box.innerHTML = '<div class="small muted" style="padding:10px">تعذّر جلب النسخ</div>'; return; }
      const list = await r.json();
      if (!list || !list.length) { box.innerHTML = '<div class="small muted" style="padding:10px">لا توجد نسخ بعد</div>'; return; }
      box.innerHTML = `<table class="tbl"><thead><tr><th>التاريخ</th><th>الحجم</th><th>بواسطة</th><th></th></tr></thead><tbody>
        ${list.map(b => `<tr><td class="num small">${new Date(b.at).toLocaleString('ar-SA-u-nu-latn')}</td>
          <td class="num small">${Math.round((b.size || 0) / 1024)} ك.ب</td><td class="small">${esc(b.by || '—')}</td>
          <td style="white-space:nowrap"><button class="btn btn-outline btn-sm" data-action="bk-download" data-id="${b.id}">تنزيل</button>
          ${isAdmin() ? `<button class="btn btn-outline btn-sm" data-action="bk-restore" data-id="${b.id}">استعادة</button>` : ''}</td></tr>`).join('')}
      </tbody></table>`;
    } catch (e) { box.innerHTML = '<div class="small muted" style="padding:10px">تعذّر الاتصال</div>'; }
  }
  async function downloadBackup(id) {
    try {
      const h = await sbAuthHeaders();
      const r = await fetch(SB_URL + '/rest/v1/rpc/backup_data', { method: 'POST', headers: h, body: JSON.stringify({ p_id: id }) });
      if (!r.ok) { toast('تعذّر تنزيل النسخة', 'err'); return; }
      const data = await r.json();
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'snam-backup-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) { toast('تعذّر الاتصال', 'err'); }
  }
  function restoreBackup(id) {
    askConfirm('استعادة النسخة السحابية ستستبدل البيانات الحالية بالكامل. سيتم أخذ نسخة من الوضع الحالي أولًا. متابعة؟', async () => {
      try {
        const h = await sbAuthHeaders();
        const r = await fetch(SB_URL + '/rest/v1/rpc/restore_backup', { method: 'POST', headers: h, body: JSON.stringify({ p_id: Number(id) }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) { toast(j.message || 'تعذّر الاستعادة', 'err'); return; }
        try { const data = await sbLoad(); if (data) { db = data; ensureSettings(); } } catch (e) { }
        toast('تمت الاستعادة — ' + (j.audits || 0) + ' زيارة'); render();
      } catch (e) { toast('تعذّر الاتصال', 'err'); }
    });
  }

  /* ---------------- events ---------------- */
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-inv]');
    if (!el || !ui.invSess) return;
    const line = (ui.invSess.lines || []).find(l => l.itemId === el.dataset.id);
    if (!line) return;
    line[el.dataset.inv] = el.value === '' ? null : Number(el.value);
    const diff = (line.count == null || line.count === '') ? null : (Number(line.count) - (Number(line.sys) || 0));
    const dc = document.querySelector('[data-diff="' + line.itemId + '"]');
    if (dc) { dc.textContent = diff == null ? '—' : diff; dc.style.color = diff < 0 ? 'var(--bad)' : diff > 0 ? 'var(--ok)' : 'inherit'; }
    const vc = document.querySelector('[data-val="' + line.itemId + '"]');
    const val = diff == null ? null : diff * (Number(line.price) || 0);
    if (vc) { vc.textContent = val == null ? '—' : hrMoney(val); vc.style.color = val < 0 ? 'var(--bad)' : 'inherit'; }
    const t = invTotals(ui.invSess);
    const stats = document.querySelectorAll('.me-stats b');
    if (stats.length >= 4) { stats[0].textContent = t.lines; stats[1].textContent = t.diffQty; stats[2].textContent = hrMoney(t.value); stats[3].textContent = t.pct + '%'; }
  });

  document.addEventListener('click', async e => {
    /* تكبير الصورة عند الضغط عليها */
    const zoomImg = e.target.closest('.item-photos img, .photo-grid img, .xp-card img');
    if (zoomImg && !e.target.closest('button')) {
      const cap = zoomImg.closest('figure') ? (zoomImg.closest('figure').querySelector('figcaption') || {}).innerText : '';
      openLightbox(zoomImg.src, cap);
      e.preventDefault(); return;
    }
    const t = e.target.closest('[data-action]');
    if (t) {
      const act = t.dataset.action, id = t.dataset.id;
      const MUTATING = ['new-visit', 'save-visit', 'edit-audit', 'delete-audit', 'save-finding',
        'add-city', 'save-city', 'edit-city', 'delete-city', 'toggle-city-active', 'add-branch', 'save-branch', 'edit-branch', 'delete-branch',
        'add-section', 'add-item', 'toggle-item', 'edit-item', 'delete-item', 'delete-section',
        'save-settings', 'save-maintenance', 'reset-demo', 'restore-backup'];
      const VISIT_ACTS = ['new-visit', 'save-visit', 'edit-audit', 'send-ops', 'ops-approve', 'region-approve', 'final-approve', 'seal-approve'];
      if (permDenied(act)) { toast('ليس لديك صلاحية لهذا الإجراء', 'err'); return; }
      if (MUTATING.includes(act) && !isEditor() && !isAdmin() && !(act === 'save-settings' && isAdmin()) && !((act === 'save-feature' || act === 'delete-feature' || act === 'save-ad' || act === 'delete-ad') && isManager()) && !(VISIT_ACTS.includes(act) && canEditVisits()) && !(act.startsWith('hr-') && hrCanView())) { toast('ليس لديك صلاحية التعديل', 'err'); return; }
      switch (act) {
        case 'qr-limit': {
          if (!['admin','quality_manager','ops_manager','general_supervisor'].includes((currentUser() || {}).role)) { toast('غير مصرح', 'err'); return; }
          const cur = await fetch(SB_URL + '/rest/v1/rpc/qr_usage', {
            method: 'POST', headers: Object.assign({}, await sbAuthHeaders()),
            body: JSON.stringify({ p_id: id })
          }).then(r => r.json()).catch(() => null);
          const curTxt = cur && typeof cur.max === 'number' ? ` (الحالي: ${cur.views}/${cur.max})` : '';
          const v = await new Promise(res => {
            openModal(`<div class="modal-head"><h3>مرات فتح الباركود</h3></div>
              <div class="modal-body"><p class="small muted" style="margin-bottom:10px">سيُسمح بفتح التقرير من الباركود هذا العدد فقط${esc(curTxt)}. إعادة الحفظ تصفّر العدّاد.</p>
              <input class="input num" type="number" min="1" id="qrLimField" value="${cur && cur.max ? cur.max : 10}"></div>
              <div class="modal-foot"><div class="spacer"></div>
                <button class="btn btn-outline" id="qrLimNo">إلغاء</button>
                <button class="btn btn-primary" id="qrLimYes">حفظ</button></div>`, { size: 'sm' });
            const y = qs('#qrLimYes'), n = qs('#qrLimNo');
            if (y) y.onclick = () => { const val = (qs('#qrLimField') || {}).value; closeModal(); res(val); };
            if (n) n.onclick = () => { closeModal(); res(null); };
          });
          if (v === null) return;
          const n = parseInt(v, 10);
          if (!n || n < 1) { toast('أدخل رقمًا أكبر من صفر', 'err'); return; }
          const r = await fetch(SB_URL + '/rest/v1/rpc/qr_set_limit', {
            method: 'POST', headers: Object.assign({}, await sbAuthHeaders()),
            body: JSON.stringify({ p_id: id, p_max: n })
          });
          if (r.ok) { toast('تم ضبط الحد على ' + n + ' فتحة وتصفير العدّاد'); const el = qs('#qrUsage-' + id); if (el) el.textContent = `0/${n}`; }
          else toast('تعذّر الحفظ', 'err');
          return;
        }
        case 'hr-new-emp': case 'hr-edit-emp': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          hrEmpForm(act === 'hr-edit-emp' ? hrEmp(id) : null); return;
        }
        case 'hr-save-emp': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrSaveEmp(id); return; }
        case 'hr-del-emp': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          const e = hrEmp(id); if (!e) return;
          askConfirm('حذف الموظف ' + e.name + ' وجميع سجلات حضوره؟', () => {
            const d = hrData();
            d.employees = d.employees.filter(x => x.id !== id);
            d.attendance = d.attendance.filter(x => x.empId !== id);
            d.payroll = d.payroll.filter(x => x.empId !== id);
            save(); toast('تم حذف الموظف'); render();
          }); return;
        }
        case 'hr-bio': { const e = hrEmp(id); if (e) bioEnroll(e); return; }
        case 'hr-punch': { hrPunch(id, t.dataset.kind || 'in'); return; }
        case 'hr-branch-loc': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          const bid = (qs('#hrLocBranch') || {}).value;
          const b = branchById(bid); if (!b) return;
          const g = await hrGeo();
          if (!g) { toast('تعذّر قراءة الموقع — فعّل الموقع للجوال', 'err'); return; }
          b.location = { lat: g.lat, lng: g.lng, acc: g.acc, at: new Date().toISOString() };
          save(); toast('تم حفظ موقع فرع ' + b.name + ' (دقة ' + g.acc + ' م)'); return;
        }
        case 'hr-sync-att': { ui.hrDate = (qs('#hrAttDate') || {}).value || hrDate(); render(); return; }
        case 'hr-att-edit': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrAttEdit(id); return; }
        case 'hr-att-save': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrAttSave(id); return; }
        case 'hr-new-req': { hrReqForm(); return; }
        case 'hr-save-req': { hrSaveReq(); return; }
        case 'hr-req-ok': case 'hr-req-no': {
          if (!hrCanApprove()) { toast('غير مصرح', 'err'); return; }
          const r = hrData().requests.find(x => x.id === id); if (!r) return;
          r.status = act === 'hr-req-ok' ? 'approved' : 'rejected';
          r.decidedBy = (currentUser() || {}).username; r.decidedAt = new Date().toISOString();
          save(); toast(r.status === 'approved' ? 'تم اعتماد الطلب' : 'تم رفض الطلب'); render(); return;
        }
        case 'hr-pay-load': { ui.hrMonth = (qs('#hrPayMonth') || {}).value || hrMonth(); render(); return; }
        case 'hr-gen-pay': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          ui.hrMonth = (qs('#hrPayMonth') || {}).value || hrMonth();
          askConfirm('توليد مسير ' + ui.hrMonth + ' من سجلات الحضور؟ سيستبدل المسير الحالي لهذا الشهر.', () => hrGenPay(ui.hrMonth)); return;
        }
        case 'hr-pay-edit': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrPayEdit(id); return; }
        case 'hr-pay-save': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrPaySave(id); return; }
        case 'hr-payslip': { hrPayslip(id); return; }
        case 'hr-policy-edit': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrPolicyEdit(); return; }
        case 'hr-policy-save': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrPolicySave(); return; }
        case 'hr-policy-ack': {
          const p = hrData().policy;
          const e = hrEmp(id); if (!e) return;
          askConfirm('أقر بأنني اطلعت على ' + (p.title || 'لائحة العمل') + ' وأوافق على موادها؟', () => {
            p.ack = (p.ack || []).filter(a => a.empId !== id);
            p.ack.push({ empId: id, at: new Date().toISOString(), by: (currentUser() || {}).username });
            save(); toast('تم تسجيل إقرارك'); render();
          }); return;
        }
        case 'hr-rw-load': { ui.hrMonth = (qs('#hrRwMonth') || {}).value || ui.hrMonth; render(); return; }
        case 'hr-rw-gen': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          ui.hrMonth = (qs('#hrRwMonth') || {}).value || new Date().toISOString().slice(0, 7);
          askConfirm('احتساب مكافآت المتميزين لشهر ' + ui.hrMonth + ' من تقييمات الفروع؟', () => hrRewardGen(ui.hrMonth)); return;
        }
        case 'hr-rw-ok': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          const r = hrData().rewards.find(x => x.id === id); if (!r) return;
          r.status = 'approved'; r.approvedBy = (currentUser() || {}).username;
          save(); toast('تم اعتماد المكافأة'); render(); return;
        }
        case 'me-in': { mePunch('in'); return; }
        case 'me-out': { mePunch('out'); return; }
        case 'bk-load': { if (!isAdmin() && !isQM()) { toast('غير مصرح', 'err'); return; } loadBackups(); return; }
        case 'bk-download': { downloadBackup(id); return; }
        case 'bk-restore': { if (!isAdmin()) { toast('غير مصرح', 'err'); return; } restoreBackup(id); return; }
        case 'rec-open': { if (!isAdmin() && !isQM()) { toast('غير مصرح', 'err'); return; } openRecover(); return; }
        case 'rec-restore': {
          if (!isAdmin() && !isQM()) { toast('غير مصرح', 'err'); return; }
          const ids = [...document.querySelectorAll('.rec-cb:checked')].map(c => c.dataset.id);
          if (!ids.length) { toast('حدد زيارة واحدة على الأقل', 'err'); return; }
          const list = (window.__recList || []).filter(x => ids.includes(x.audit.id));
          let n = 0;
          list.forEach(x => { if (!db.audits.some(a => a.id === x.audit.id)) { db.audits.push(x.audit); n++; } });
          save(); closeModal(); toast('تمت استعادة ' + n + ' زيارة'); render(); return;
        }
        case 'user-perms': { if (!isAdmin()) { toast('غير مصرح', 'err'); return; } openUserProfile(id); return; }
        case 'up-save': { if (!isAdmin()) { toast('غير مصرح', 'err'); return; } saveUserPerms(id); return; }
        case 'up-toggle': {
          if (!isAdmin()) { toast('غير مصرح', 'err'); return; }
          const u = db.users.find(x => x.id === id); if (!u) return;
          u.active = u.active === false; save(); closeModal(); toast(u.active ? 'تم تفعيل الحساب' : 'تم إيقاف الحساب'); render(); return;
        }
        case 'up-delete': {
          if (!isAdmin()) { toast('غير مصرح', 'err'); return; }
          const u = db.users.find(x => x.id === id); if (!u) return;
          askConfirm('حذف حساب ' + (u.name || u.username) + ' نهائيًا؟', () => {
            db.users = db.users.filter(x => x.id !== id); save(); closeModal(); toast('تم حذف الحساب'); render();
          }); return;
        }
        case 'up-reset': {
          if (!isAdmin()) { toast('غير مصرح', 'err'); return; }
          const u = db.users.find(x => x.id === id); if (!u) return;
          const pw = 'Snam@' + Math.floor(100000 + Math.random() * 899999);
          (async () => {
            try {
              const h = await sbAuthHeaders();
              const r = await fetch(SB_URL + '/rest/v1/rpc/admin_set_password', { method: 'POST', headers: h, body: JSON.stringify({ p_username: u.username, p_password: pw }) });
              if (!r.ok) { toast('تعذّر تغيير كلمة المرور', 'err'); return; }
              u.pass = await sha256(pw); save();
              askConfirm('كلمة المرور الجديدة لـ ' + (u.name || u.username) + ': ' + pw + ' — احفظها الآن.', () => { });
            } catch (e) { toast('تعذّر الاتصال', 'err'); }
          })(); return;
        }
        case 'perm-none': {
          if (!isAdmin()) { toast('غير مصرح', 'err'); return; }
          document.querySelectorAll('.perm-cb[data-mod="' + t.dataset.mod + '"]').forEach(cb => { cb.checked = false; });
          return;
        }
        case 'inv-item-new': { if (!invCanCreate()) { toast('غير مصرح', 'err'); return; } invItemForm(null); return; }
        case 'inv-item-edit': { if (!invCanCreate()) { toast('غير مصرح', 'err'); return; } invItemForm(id); return; }
        case 'inv-item-del': {
          if (!invCanCreate()) { toast('غير مصرح', 'err'); return; }
          const it = invItem(id); if (!it) return;
          askConfirm('حذف الصنف ' + it.name + '؟', () => { const d = invData(); d.items = d.items.filter(x => x.id !== id); save(); toast('تم الحذف'); render(); }); return;
        }
        case 'inv-item-save': {
          if (!invCanCreate()) { toast('غير مصرح', 'err'); return; }
          const d = invData();
          const g = k => (qs('#ii_' + k) || {}).value || '';
          const name = g('name').trim(); if (!name) { toast('اسم الصنف مطلوب', 'err'); return; }
          let it = id ? d.items.find(x => x.id === id) : null;
          if (!it) { it = { id: 'IT-' + Date.now().toString(36).toUpperCase() }; d.items.push(it); }
          Object.assign(it, { code: g('code').trim(), name, unit: g('unit'), price: Number(g('price')) || 0, cat: g('cat').trim(), branchId: g('branch'), active: g('active') === '1' });
          save(); closeModal(); toast('تم حفظ الصنف'); render(); return;
        }
        case 'inv-start': {
          if (!invCanCreate()) { toast('غير مصرح', 'err'); return; }
          ui.invBranch = (qs('#invNewBranch') || {}).value || '';
          invStart(t.dataset.kind || 'daily'); return;
        }
        case 'inv-save': {
          if (!ui.invSess) return;
          ui.invSess.notes = (qs('#invNotes') || {}).value || '';
          ui.invSess.status = ui.invSess.status === 'approved' ? 'approved' : (ui.invSess.status === 'done' ? 'done' : 'draft');
          invSessSave(); return;
        }
        case 'inv-done': {
          if (!ui.invSess) return;
          ui.invSess.notes = (qs('#invNotes') || {}).value || '';
          if (!invTotals(ui.invSess).lines) { toast('أدخل كمية فعلية لصنف واحد على الأقل', 'err'); return; }
          ui.invSess.status = 'done'; invSessSave(); return;
        }
        case 'inv-approve': {
          if (!invCanApprove()) { toast('غير مصرح', 'err'); return; }
          const s0 = invSession(id) || ui.invSess; if (!s0) return;
          askConfirm('اعتماد جرد ' + s0.no + '؟ لن يُعدّل بعدها.', () => {
            s0.status = 'approved'; s0.approvedBy = (currentUser() || {}).username; s0.approvedAt = new Date().toISOString();
            const d = invData(); const i = d.sessions.findIndex(x => x.id === s0.id);
            if (i >= 0) d.sessions[i] = s0; else d.sessions.push(s0);
            save(); toast('تم اعتماد الجرد'); render();
          }); return;
        }
        case 'inv-print': { invPrintSess(id); return; }
        case 'inv-print-list': {
          const list = invSessions().slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          const rows = list.map(s => { const t = invTotals(s); return `<tr><td>${esc(s.no)}</td><td>${invType(s.type).short}</td><td>${esc((branchById(s.branchId) || {}).name || '')}</td><td>${s.date}</td><td>${t.lines}</td><td>${t.diffQty}</td><td>${hrMoney(t.value)}</td></tr>`; }).join('');
          hrPrintDoc('كشف عمليات الجرد', 'كل الأنواع — ' + list.length + ' عملية', `<table><thead><tr><th>الرقم</th><th>النوع</th><th>الفرع</th><th>التاريخ</th><th>الأصناف</th><th>الفرق</th><th>قيمة الفرق</th></tr></thead><tbody>${rows || '<tr><td colspan="7">لا يوجد</td></tr>'}</tbody></table>`, { count: list.length });
          return;
        }
        case 'inv-filter': {
          ui.invFilterType = (qs('#invFType') || {}).value || 'all';
          ui.invFrom = (qs('#invFFrom') || {}).value || '';
          ui.invTo = (qs('#invFTo') || {}).value || '';
          render(); return;
        }
        case 'hr-print': { const k = t.dataset.kind; if (k === 'card') ui.hrCard = id; hrPrint(k); return; }
        case 'hr-card': { ui.hrCard = id; hrPrint('card'); return; }
        case 'hr-mk-login': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrMakeLogin(id); return; }
        case 'hr-mk-login-save': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrMakeLoginSave(id); return; }
        case 'hr-face-enroll': {
          if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; }
          const e = hrEmp(id); if (!e) return;
          faceModal('تسجيل وجه الموظف', e.name + ' — انظر للكاميرا في إضاءة جيدة', 'enroll', e, (desc) => {
            e.face = desc; e.faceAt = new Date().toISOString(); e.faceBy = (currentUser() || {}).username;
            save(); toast('تم تسجيل الوجه — يستطيع الموظف تسجيل حضوره من جواله'); render();
          }); return;
        }
        case 'hr-settings-save': { if (!hrCanEdit()) { toast('غير مصرح', 'err'); return; } hrSettingsSave(); return; }
        case 'save-maintenance': {
          if (!isAdmin()) { toast('هذا الإعداد لمدير لوحة التحكم فقط', 'err'); return; }
          const en = qs('#mEnabled').checked;
          let st = qs('#mStart').value;
          const en2 = qs('#mEnd').value;
          if (en && !en2) { toast('حدد وقت نهاية التحديث', 'err'); return; }
          let grace = false;
          if (en && (!st || new Date(st).getTime() <= Date.now())) {
            const d = new Date(Date.now() + 10 * 60000);
            const p = n => String(n).padStart(2, '0');
            st = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
            grace = true; qs('#mStart').value = st;
          }
          if (st && en2 && new Date(st) >= new Date(en2)) { toast('وقت النهاية يجب أن يكون بعد وقت البداية', 'err'); return; }
          const allow = ((qs('#mAllow') || {}).value || '').split(',').map(x => x.trim()).filter(Boolean);
          db.settings.maintenance = { enabled: en, start: st, end: en2, msg: (qs('#mMsg').value || '').trim() || 'نظام الجودة تحت التحديثات', allow: allow.length ? allow : ['الموارد البشرية', 'admin'] };
          save(); paintMaintenance();
          toast(en ? (grace ? 'تم تفعيل التحديثات — يبدأ الإغلاق بعد 10 دقائق' : 'تم تفعيل وضع التحديثات') : 'تم إيقاف وضع التحديثات'); return;
        }
        case 'compress-photos': {
          if (!isAdmin() && !isEditor()) { toast('غير مصرح', 'err'); return; }
          compressPhotos(); return;
        }
        case 'save-followup': {
          if (!isQM() && !isAdmin()) { toast('الكتابة من صلاحية مدير الجودة', 'err'); return; }
          const txt = (qs('#followNote') || {}).value || '';
          db.settings.analysisFollowups = db.settings.analysisFollowups || {};
          db.settings.analysisFollowups[t.dataset.key] = { text: txt.trim(), by: (currentUser() || {}).name || 'مدير الجودة', at: TODAY_ISO() };
          save(); render(); toast('تم حفظ سبب عدم المتابعة'); return;
        }
        case 'approve-analysis': {
          if (!isQM()) { toast('اعتماد التحليل من صلاحية مدير الجودة', 'err'); return; }
          const key = t.dataset.key;
          db.settings.analysisApprovals = db.settings.analysisApprovals || {};
          db.settings.analysisApprovals[key] = { by: (currentUser() || {}).name || 'مدير الجودة', at: TODAY_ISO() };
          save(); render(); toast('تم اعتماد التحليل — جاهز للطباعة والإرسال'); return;
        }
        case 'toggle-pass': {
          const inp = qs('#loginPass'); if (!inp) return;
          const show = inp.type === 'password';
          inp.type = show ? 'text' : 'password';
          t.classList.toggle('on', show);
          t.setAttribute('aria-label', show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور');
          try { inp.focus({ preventScroll: true }); inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) { }
          return;
        }
        case 'toggle-region': {
          const k = 'r:' + t.dataset.region;
          const cur = treeOpen[k] !== undefined ? !!treeOpen[k] : (scopeRegion() === t.dataset.region || !!ui.filters.branches.q);
          treeOpen[k] = !cur; persistTree(); render(); return;
        }
        case 'toggle-city': {
          const k = 'c:' + t.dataset.city;
          treeOpen[k] = !(treeOpen[k] !== undefined ? !!treeOpen[k] : !!ui.filters.branches.q);
          persistTree(); render(); return;
        }
        case 'download-pdf': {
          toast('اختر «حفظ كـ PDF» من نافذة الطباعة — يُحفظ على جهازك');
          setTimeout(() => { try { window.print(); } catch (e) { } }, 500);
          return;
        }
        case 'open-login': openLogin(); return;
        case 'open-changelog': window.open(location.pathname + '#/changelog', '_blank'); return;
        case 'hard-refresh': (async () => {
          try {
            const regs = await navigator.serviceWorker.getRegistrations();
            await Promise.all(regs.map(r => r.unregister()));
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          } catch (e) { }
          location.reload();
        })(); return;
        case 'add-ad': openAdModal(null); return;
        case 'edit-ad': openAdModal(id); return;
        case 'save-ad': saveAd(id); return;
        case 'delete-ad': {
          const s0 = S();
          if (!confirm('حذف هذا الإعلان؟')) return;
          s0.ads = (s0.ads || []).filter(x => x.id !== id);
          save(); closeModal(); render(); toast('تم حذف الإعلان'); return;
        }
        case 'add-feature': openFeatureModal(null); return;
        case 'edit-feature': openFeatureModal(id); return;
        case 'save-feature': saveFeature(id); return;
        case 'delete-feature': {
          const s0 = S();
          if (!confirm('حذف هذه البطاقة؟')) return;
          s0.featured = (s0.featured || []).filter(x => x.id !== id);
          save(); closeModal(); render(); toast('تم حذف البطاقة'); return;
        }
        case 'goto-landing': navigate('landing'); return;
        case 'bmtype': ui.filters.bm.type = t.dataset.type; ui.page = 1; render(); return;
        case 'bm-export': exportBM(t.dataset.fmt); return;
        case 'visits-kind': ui.filters.visits.type = t.dataset.kind === 'bm' ? 'bm' : 'all'; navigate('visits'); return;
        case 'new-visit': newWizard(); return;
        case 'new-bm-visit': newWizard(null, null, 'bm_monthly'); return;
        case 'new-inv-visit': invWizard(); return;
        case 'edit-inv': closeModal(); invWizard(id); return;
        case 'close-inv': iwiz = null; closeModal(); render(); return;
        case 'inv-save': invSave(); return;
        case 'inv-del-file': {
          invCapture();
          const arr = (iwiz.attach || {})[t.dataset.item] || [];
          arr.splice(Number(t.dataset.idx), 1);
          iwiz.attach[t.dataset.item] = arr;
          qs('#invBody').innerHTML = invHeaderHTML() + invFormHTML();
          return;
        }
        case 'inv-add-row': {
          invCapture();
          const sec = (db.invSections || []).find(x => x.id === t.dataset.sec);
          iwiz.rows[t.dataset.sec] = iwiz.rows[t.dataset.sec] || [];
          iwiz.rows[t.dataset.sec].push(new Array((sec ? sec.cols.length : 5)).fill(''));
          qs('#invBody').innerHTML = invFormHTML();
          return;
        }
        case 'inv-del-row': {
          invCapture();
          (iwiz.rows[t.dataset.sec] || []).splice(Number(t.dataset.row), 1);
          qs('#invBody').innerHTML = invFormHTML();
          return;
        }
        case 'back-inv': ui.route = 'invvisits'; render(); return;
        case 'print-inv': window.print(); return;
        case 'pdf-inv': toast('اختر «حفظ كـ PDF» من نافذة الطباعة'); setTimeout(() => window.print(), 350); return;
        case 'word-inv': exportInvDoc(id); return;
        case 'inv-export': exportInv(t.dataset.fmt); return;
        case 'close-modal': closeModal(); return;
        case 'close-drawer': closeDrawer(); return;
        case 'close-wizard': captureWizard(); closeModal(); wiz = null; toast('تم حفظ المسودة'); return;
        case 'pause-visit': saveDraftNow('تم حفظ الزيارة — تقدر تكملها لاحقًا من زر «استئناف»'); closeModal(); wiz = null; render(); return;
        case 'resume-draft': resumeDraft(); return;
        case 'discard-draft': askConfirm('حذف الزيارة المحفوظة؟ ستفقد ما أدخلته فيها.', () => {
          localStorage.removeItem(DRAFT_KEY);
          if (session && db.drafts) delete db.drafts[session];
          save(); render(); toast('تم حذف المسودة');
        }); return;
        case 'branch-metric': openBranchMetric(t.dataset.kind); return;
        case 'open-audit': closeDrawer(); openAudit(id); return;
        case 'view-audit': closeModal(); closeDrawer(); ui.filters.auditId = id; ui.route = 'audit'; render(); return;
        case 'back-visits': navigate('visits'); return;
        case 'edit-audit': {
          const v = db.audits.find(x => x.id === id);
          if (!canEditVisit(v)) { toast('التعديل لمدير الجودة الذي أنشأ التقرير فقط', 'err'); return; }
          if (v && v.approval === 'approved' && !confirm('هذه الزيارة معتمدة ومختومة. التعديل سيلغي الاعتماد ويعيدها لمسار المراجعة. متابعة؟')) return;
          newWizard(null, id); return;
        }
        case 'send-ops': {
          const u = currentUser();
          if (!u || !['quality_manager', 'admin'].includes(u.role)) { toast('الإرسال من صلاحية مدير الجودة', 'err'); return; }
          const x = db.audits.find(v => v.id === id); if (!x) return;
          x.approval = 'pending_ops';
          x.sentBy = u.name || 'مدير الجودة';
          x.sentAt = TODAY_ISO();
          x.returnReason = '';
          signAudit(x, 'quality');
          x.updatedAt = new Date().toISOString();
          save(); render(); toast('أُرسل التقرير إلى مدير التشغيل للاعتماد'); return;
        }
        case 'ops-approve': {
          const u = currentUser();
          if (!u || u.role !== 'ops_manager') { toast('هذه الصلاحية لمدير التشغيل', 'err'); return; }
          const x = db.audits.find(v => v.id === id); if (!x) return;
          x.approval = 'approved';
          x.opsBy = u.name || 'مدير التشغيل';
          x.opsAt = TODAY_ISO();
          x.sealedBy = u.name || 'مدير التشغيل';
          x.sealedAt = TODAY_ISO();
          x.finalTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
          x.returnReason = '';
          signAudit(x, 'ops');
          x.updatedAt = new Date().toISOString();
          save(); render(); toast('تم الاعتماد النهائي وختم التقرير — مدير التشغيل'); return;
        }
        case 'my-signature': openSignatureModal(); return;
        case 'clear-signature': {
          const u0 = currentUser(); if (!u0) return;
          if (!confirm('حذف توقيعك الإلكتروني؟')) return;
          delete u0.signature; save(); closeModal(); toast('تم حذف التوقيع'); return;
        }
        case 'return-audit': openReturnModal(id); return;
        case 'confirm-return': {
          if (!isCeo()) { toast('هذه الصلاحية للمدير التنفيذي', 'err'); return; }
          const reason = (qs('#returnReason').value || '').trim();
          if (!reason) { toast('اكتب سبب الإعادة', 'err'); return; }
          const x = db.audits.find(v => v.id === id); if (!x) return;
          x.approval = 'draft';
          x.returnReason = reason;
          x.returnedBy = (currentUser() || {}).name || 'المدير التنفيذي';
          x.returnedAt = TODAY_ISO();
          x.updatedAt = new Date().toISOString();
          save(); closeModal(); render();
          toast('أُعيد التقرير لصاحبه مع سبب الإعادة'); return;
        }
        case 'region-approve': {
          const u = currentUser();
          if (!u || u.role !== 'regional_manager') { toast('هذه الصلاحية لمدير المنطقة', 'err'); return; }
          const x = db.audits.find(v => v.id === id); if (!x) return;
          if (!inMyRegion(x)) { toast('هذا التقرير لفرع خارج منطقتك', 'err'); return; }
          x.approval = 'pending_final';
          x.regionBy = u.name || 'مدير المنطقة';
          x.regionAt = TODAY_ISO();
          x.updatedAt = new Date().toISOString();
          save(); render(); toast('اعتمدها مدير المنطقة — أُحيلت للمشرف العام'); return;
        }
        case 'final-approve': {
          if (!canFinalApprove()) { toast('هذه الصلاحية للمشرف العام', 'err'); return; }
          const u = currentUser();
          const x = db.audits.find(v => v.id === id); if (!x) return;
          if (!['pending_ceo', 'pending_final'].includes(x.approval)) { toast('التقرير ليس بانتظار الاعتماد', 'err'); return; }
          x.approval = 'approved';
          x.sealedBy = (u && (u.name || (u.role === 'ceo' ? 'المدير التنفيذي' : ROLES[u.role]))) || 'المدير التنفيذي';
          x.sealedAt = TODAY_ISO();
          x.finalBy = x.sealedBy;
          x.finalAt = TODAY_ISO();
          x.finalTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
          signAudit(x, 'ceo');
          x.returnReason = '';
          x.updatedAt = new Date().toISOString();
          save(); render(); toast('تم اعتماد التقرير وختمه — جاهز للطباعة والباركود'); return;
        }
        case 'seal-approve': {
          const u = currentUser();
          if (!u || !['quality_manager', 'admin'].includes(u.role)) { toast('الختم من صلاحية مدير الجودة', 'err'); return; }
          const x = db.audits.find(v => v.id === id); if (!x) return;
          x.approval = 'approved';
          x.sealedBy = u.name || 'مدير الجودة';
          x.sealedAt = '2026-11-06';
          x.updatedAt = new Date().toISOString();
          save(); render(); toast('تم ختم الزيارة واعتمادها نهائيًا'); return;
        }
        case 'delete-audit': {
          const target = db.audits.find(v => v.id === id);
          if (!target) return;
          if (!isAdmin() && !canEditVisit(target)) { toast('الحذف لمدير الجودة الذي أنشأ التقرير فقط', 'err'); return; }
          if (target.approval === 'approved' && !isAdmin()) { toast('التقرير المعتمد والمختوم لا يُحذف إلا من إدارة الموقع', 'err'); return; }
          if (!confirm('هل ترغب بحذف هذا التقرير نهائيًا مع كل ملاحظاته؟ لا يمكن التراجع.')) return;
          db.audits = db.audits.filter(a => a.id !== id);
          db.findings = db.findings.filter(f => f.auditId !== id);
          save(); closeModal(); closeDrawer(); toast('تم حذف الزيارة'); navigate('visits'); return;
        }
        case 'open-branch': closeModal(); closeDrawer(); openBranch(id); return;
        case 'open-finding': closeModal(); closeDrawer(); openFinding(id); return;
        case 'del-finding-file': {
          const fnd2 = db.findings.find(x => x.id === t.dataset.id);
          if (fnd2 && Array.isArray(fnd2.files)) { fnd2.files.splice(Number(t.dataset.idx), 1); save(); openFinding(fnd2.id); }
          return;
        }
        case 'del-finding-photo': {
          const fnd = db.findings.find(x => x.id === t.dataset.id);
          if (fnd && Array.isArray(fnd.photos)) { fnd.photos.splice(Number(t.dataset.idx), 1); save(); openFinding(fnd.id); }
          return;
        }
        case 'save-finding': {
          const f = db.findings.find(x => x.id === id);
          if (f) {
            const newStatus = qs('#fStatus').value;
            if (newStatus === 'مغلق' && !(f.photos || []).length && !(f.files || []).length) { toast('أضف صورة أو ملف PDF للتصحيح قبل الإغلاق', 'err'); return; }
            f.status = newStatus; f.due = qs('#fDue').value; f.owner = qs('#fOwner').value;
            f.action = qs('#fAction').value;
            f.closedAt = f.status === 'مغلق' ? (qs('#fClosed').value || TODAY_ISO()) : '';
            save(); closeDrawer(); render(); toast('تم تحديث الملاحظة');
          }
          return;
        }
        case 'save-settings': saveSettings(); return;
        case 'dictate': {
          const inp = document.querySelector(t.dataset.target || '');
          toggleDictation(inp, t);
          return;
        }
        case 'add-user': openUserModal(); return;
        case 'edit-user': openUserModal(id); return;
        case 'save-user': saveUser(id); return;
        case 'toggle-user': toggleUser(id); return;
        case 'delete-user': deleteUser(id); return;
        case 'do-login': doLogin(); return;
        case 'change-pass': openChangePass(); return;
        case 'save-my-pass': saveMyPass(); return;
        case 'save-my-profile': saveMyProfile(); return;
        case 'save-forms': save(); render(); toast('تم حفظ الاستمارة'); return;
        case 'logout': logout(); return;
        case 'open-backups': openBackups(); return;
        case 'backup-now': backupNow(); return;
        case 'restore-backup': restoreBackup(t.dataset.ts); return;
        case 'download-backup': {
          BK.all().then(list => {
            const snap = list.find(x => String(x.ts) === String(t.dataset.ts));
            if (!snap) { toast('النسخة غير موجودة', 'err'); return; }
            const blob = new Blob([JSON.stringify(snap.data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'snam-backup-' + new Date(snap.ts).toISOString().slice(0, 10) + '.json';
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 3000);
            toast('تم تنزيل النسخة');
          });
          return;
        }
        case 'delete-backup': BK.del(Number(t.dataset.ts)).then(() => { closeModal(); toast('تم حذف النسخة'); }); return;
        case 'reset-logo': {
          pendingLogo = null;
          db.settings.logo = 'assets/brand/snam-logo-gold.png';
          save(); render(); toast('تم استعادة الشعار'); return;
        }
        case 'reset-demo': {
          if (confirm('سيتم حذف كل التعديلات واستعادة البيانات التجريبية. متابعة؟')) {
            localStorage.removeItem(window.SNAM.DB_KEY);
            db = window.SNAM.SEED(); save(); render(); toast('تمت إعادة التعيين');
          }
          return;
        }
        case 'export-csv': exportCsv(t.dataset.kind || 'branches'); return;
        case 'export-json': download('snam-backup.json', JSON.stringify(db, null, 2), 'application/json'); toast('تم تصدير النسخة'); return;
        case 'print':
        case 'print-written': printSheet('written'); return;
        case 'print-photos': printSheet('photos'); return;
        case 'word-written': exportWord(qs('#auditReport'), 'تقرير-زيارة-' + id); return;
        case 'word-photos': exportWord(qs('#photoReport'), 'ملحق-صور-زيارة-' + id); return;
        case 'word-period': exportWord(qs('#annualReport'), 'تقرير-' + (ui.filters.report.from || TODAY_ISO()) + '-' + (ui.filters.report.to || TODAY_ISO())); return;
        case 'notify': openNotifications(); return;
        case 'open-search': openSearch(); return;
        case 'vtype': ui.filters.visits.type = t.dataset.type; ui.page = 1; render(); return;
        case 'fstatus': ui.filters.findings.status = t.dataset.status; ui.page = 1; render(); return;
        case 'rfilter': ui.filters.branches.region = t.dataset.region; render(); return;
        case 'page': ui.page = Number(t.dataset.page); render(); return;
        case 'toggle-sidebar': qs('#sidebar').classList.contains('open') ? closeSidebar() : openSidebar(); return;
        case 'back-reports': navigate('reports'); return;
        case 'open-report': {
          if (!ui.filters.report.branch) { toast('اختر المنطقة ثم المدينة ثم الفرع', 'err'); return; }
          navigate('report'); return;
        }
        case 'open-annual': {
          let bid = id;
          if (bid === '__selected') { const sel = qs('#reportBranchSel'); bid = sel ? sel.value : db.branches[0].id; }
          ui.filters.report.branch = bid;
          const br0 = db.branches.find(x => x.id === bid);
          if (br0) { ui.filters.report.region = br0.regionId; ui.filters.report.city = br0.cityId; }
          ui.filters.report.mode = t.dataset.mode || (id === '__selected' ? 'annual' : 'monthly');
          if (ui.filters.report.mode === 'monthly') {
            const arr = db.audits.filter(x => x.branchId === bid).map(x => new Date(x.date + 'T00:00:00')).filter(d => !isNaN(d)).sort((x, y) => y - x);
            if (arr.length) { ui.filters.report.month = arr[0].getMonth(); ui.filters.report.year = arr[0].getFullYear(); }
            else { ui.filters.report.month = TODAY.getMonth(); }
          }
          closeModal(); closeDrawer(); navigate('report'); return;
        }
        case 'add-city': openCityModal(t.dataset.region); return;
        case 'save-city': saveCity(t.dataset.id || ''); return;
        case 'edit-city': openCityModal(cityById(t.dataset.city).regionId, t.dataset.city); return;
        case 'toggle-city-active': {
          const c = db.cities.find(x => x.id === t.dataset.city); if (!c) return;
          c.active = c.active === false;
          save(); render(); toast(c.active === false ? 'تم إيقاف المدينة ' + c.name : 'تم تفعيل المدينة ' + c.name); return;
        }
        case 'delete-city': {
          const c = cityById(t.dataset.city); if (!c || !c.id) return;
          if (branchesOfCity(c.id).length) { toast('لا يمكن حذف مدينة فيها فروع — احذف الفروع أو انقلها أولًا', 'err'); return; }
          if (!confirm('حذف مدينة «' + c.name + '»؟')) return;
          db.cities = db.cities.filter(x => x.id !== c.id); save(); render(); toast('تم حذف المدينة'); return;
        }
        case 'add-branch': openBranchModal(t.dataset.city); return;
        case 'edit-branch': openBranchModal(branchById(id).cityId, id); return;
        case 'save-branch': saveBranch(id); return;
        case 'geo-branch': {
          if (!navigator.geolocation) { toast('الجهاز لا يدعم تحديد الموقع', 'err'); return; }
          toast('جارٍ تحديد الموقع…');
          navigator.geolocation.getCurrentPosition(pos => {
            const la = pos.coords.latitude.toFixed(6), ln = pos.coords.longitude.toFixed(6);
            const latEl = qs('#brLat'), lngEl = qs('#brLng'), mapEl = qs('#brMap'), info = qs('#geoInfo');
            if (latEl) latEl.value = la; if (lngEl) lngEl.value = ln;
            if (info) info.textContent = 'تم تحديد الموقع: ' + la + ', ' + ln;
            if (mapEl && !mapEl.value.trim()) mapEl.value = 'https://maps.google.com/?q=' + la + ',' + ln;
            toast('تم تحديد موقع الفرع');
          }, err => toast(err.code === 1 ? 'اسمح للموقع بالوصول للموقع الجغرافي' : 'تعذر تحديد الموقع', 'err'), { enableHighAccuracy: true, timeout: 15000 });
          return;
        }
        case 'delete-branch': {
          const b = branchById(id);
          if (!confirm(`حذف ${b.name} وكل زياراته وملاحظاته؟`)) return;
          const ids = db.audits.filter(a => a.branchId === id).map(a => a.id);
          db.branches = db.branches.filter(x => x.id !== id);
          db.audits = db.audits.filter(a => a.branchId !== id);
          db.findings = db.findings.filter(f => f.branchId !== id && !ids.includes(f.auditId));
          save(); closeDrawer(); render(); toast('تم حذف الفرع'); return;
        }
        case 'add-section': {
          const set = editSet();
          askInput('اسم المحور الجديد:', '', name => { set.push({ id: 's' + Date.now(), name, group: null, order: set.length + 1, active: true, items: [] }); save(); render(); toast('تمت إضافة المحور'); });
          return;
        }
        case 'add-item': {
          const sec = secById(t.dataset.section);
          askInput('نص البند الجديد:', '', text => {
            if (!sec) return;
            sec.items.push({ id: 'i' + Date.now(), text, max: setItemMax(), active: true });
            save(); render(); toast('تمت إضافة البند');
          });
          return;
        }
        case 'toggle-item': {
          const it = itemById(t.dataset.item);
          if (it) { const real = it.section.items.find(x => x.id === it.id); real.active = real.active === false; save(); render(); }
          return;
        }
        case 'edit-item': {
          const it = itemById(t.dataset.item);
          if (it) askInput('تعديل نص البند:', it.text, text => { it.section.items.find(x => x.id === it.id).text = text; save(); render(); toast('تم تعديل البند'); });
          return;
        }
        case 'delete-item': {
          const it = itemById(t.dataset.item);
          if (it) askConfirm('حذف هذا البند؟ لن يمكن التراجع.', () => { it.section.items = it.section.items.filter(x => x.id !== it.id); save(); render(); toast('تم حذف البند'); });
          return;
        }
        case 'delete-section': {
          const sec = secById(t.dataset.section);
          if (sec) askConfirm('حذف المحور «' + sec.name + '» وكل بنوده؟', () => {
            if (ui.editInv || ui.route === 'form-inv') db.invSections = (db.invSections || []).filter(s => s.id !== sec.id);
            else if (ui.editBm || ui.route === 'form-bm') db.bmSections = (db.bmSections || []).filter(s => s.id !== sec.id);
            else db.sections = db.sections.filter(s => s.id !== sec.id);
            save(); render(); toast('تم حذف المحور');
          });
          return;
        }
        case 'wiz-next': captureWizard(); wiz.step = Math.min(wiz.step + 1, stepsCount() - 1); renderWizardStep(); return;
        case 'wiz-prev': captureWizard(); wiz.step = Math.max(0, wiz.step - 1); renderWizardStep(); return;
        case 'wiz-step': captureWizard(); wiz.step = Number(t.dataset.step); renderWizardStep(); return;
        case 'wiz-save': captureWizard(); toast('تم حفظ المحور — يمكنك المتابعة لاحقًا'); return;
        case 'wiz-finish': finishWizard(); return;
        case 'del-photo': if (wiz) { delete wiz.photos[t.dataset.item]; renderWizardStep(); } return;
        case 'del-item-photo': if (wiz) {
          const it0 = t.dataset.item, idx = Number(t.dataset.idx);
          const arr0 = Array.isArray(wiz.photos[it0]) ? wiz.photos[it0] : [];
          arr0.splice(idx, 1);
          if (arr0.length) wiz.photos[it0] = arr0; else delete wiz.photos[it0];
          captureWizard(); renderWizardStep();
        } return;
        case 'del-extra-photo': if (wiz) { wiz.extraPhotos = (wiz.extraPhotos || []).filter(x => x.id !== t.dataset.xphoto); renderWizardStep(); } return;
      }
    }
    const nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); closeDrawer(); closeModal(); closeSidebar(); navigate(nav.dataset.nav); return; }
    if (e.target.id === 'overlay') { closeModal(); closeDrawer(); }
    if (e.target.id === 'sideBackdrop') { closeSidebar(); }
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'wRegion' || el.id === 'wCity') {
      captureWizard();
      if (el.id === 'wRegion') {
        wiz.regionId = el.value;
        wiz.cityId = defaultCityFor(wiz.regionId);
      } else {
        wiz.cityId = el.value;
      }
      const fb = db.branches.find(b => b.cityId === wiz.cityId);
      wiz.branchId = fb ? fb.id : '';
      renderWizardStep(); return;
    }
    if (el.dataset.filter === 'kpiRegion') { ui.filters.kpiRegion = el.value; render(); return; }
    if (el.dataset.filter) {
      const [g, k] = el.dataset.filter.split('.');
      if (g === 'analysis') {
        ui.filters.analysis[k] = el.value;
        if (k === 'region') { ui.filters.analysis.city = 'all'; ui.filters.analysis.branch = 'all'; }
        if (k === 'city') { ui.filters.analysis.branch = 'all'; }
      } else if (g === 'report' && k === 'region') {
        ui.filters.report.region = el.value;
        ui.filters.report.city = '';
        ui.filters.report.branch = '';
      } else if (g === 'report' && k === 'city') {
        ui.filters.report.city = el.value;
        ui.filters.report.branch = '';
      } else if (g === 'report' && (k === 'mode' || k === 'month' || k === 'year')) {
        ui.filters.report[k] = el.value;
        if (k === 'mode') { ui.filters.report.from = ''; ui.filters.report.to = ''; }
        if (k === 'month' || k === 'year') { ui.filters.report.from = ''; ui.filters.report.to = ''; }
      } else {
        ui.filters[g][k] = el.value;
      }
      ui.page = 1; render(); return;
    }
    if (el.dataset.photo || el.dataset.extraPhoto != null) { handlePhoto(el); return; }
    if (el.dataset.findpdf) {
      const fnd = db.findings.find(x => x.id === el.dataset.findpdf);
      const file = (el.files || [])[0];
      if (!fnd || !file) return;
      if (file.size > 6 * 1024 * 1024) { toast('الملف أكبر من 6 ميجا', 'err'); return; }
      uploadBlob(file, 'pdf').then(url => {
        if (!url) { toast('تعذّر رفع الملف', 'err'); return; }
        fnd.files = fnd.files || []; fnd.files.push({ url, name: file.name });
        save(); openFinding(fnd.id);
      });
      return;
    }
    if (el.dataset.findphoto) {
      const fnd = db.findings.find(x => x.id === el.dataset.findphoto);
      const file = (el.files || [])[0];
      if (!fnd || !file) return;
      const rd = new FileReader();
      rd.onload = ev2 => {
        const img = new Image();
        img.onload = () => {
          const max = 900; let w = img.width, h = img.height;
          const r = Math.min(1, max / Math.max(w, h)); w = Math.round(w * r); h = Math.round(h * r);
          const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
          cv.getContext('2d').drawImage(img, 0, 0, w, h);
          const src = cv.toDataURL('image/jpeg', 0.55);
          fnd.photos = fnd.photos || []; fnd.photos.push(src);
          save(); openFinding(fnd.id);
        };
        img.src = ev2.target.result;
      };
      rd.readAsDataURL(file);
      return;
    }
    if (el.dataset.invimg || el.dataset.invpdf) { invAddFile(el); return; }
    if (el.hasAttribute('data-invregion')) {
      invCapture(); iwiz.regionId = el.value;
      iwiz.cityId = defaultCityFor(iwiz.regionId);
      const bb = db.branches.find(b => b.cityId === iwiz.cityId);
      if (bb) { iwiz.branchId = bb.id; iwiz.data['inv1-2'] = bb.manager || ''; }
      qs('#invBody').innerHTML = invHeaderHTML() + invFormHTML();
      return;
    }
    if (el.hasAttribute('data-invcity')) {
      invCapture(); iwiz.cityId = el.value;
      const bb = db.branches.find(b => b.cityId === iwiz.cityId);
      if (bb) { iwiz.branchId = bb.id; if (!iwiz.data['inv1-2']) iwiz.data['inv1-2'] = bb.manager || ''; }
      qs('#invBody').innerHTML = invHeaderHTML() + invFormHTML();
      return;
    }
    if (el.hasAttribute('data-invbranch')) {
      invCapture(); iwiz.branchId = el.value;
      const bb = branchById(iwiz.branchId);
      iwiz.data['inv1-2'] = bb.manager || '';
      qs('#invBody').innerHTML = invHeaderHTML() + invFormHTML();
      return;
    }
    if (el.hasAttribute('data-sig')) { handleSignature(el); return; }
    if (el.hasAttribute('data-ad-img')) {
      const f0 = el.files && el.files[0]; if (!f0) return;
      const rd = new FileReader();
      rd.onload = e2 => {
        const im = new Image();
        im.onload = () => {
          const ratio = Math.min(1, 1200 / Math.max(im.width, im.height));
          const c = document.createElement('canvas');
          c.width = Math.round(im.width * ratio); c.height = Math.round(im.height * ratio);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          pendingAdImg = c.toDataURL('image/jpeg', 0.65);
          openAdModal(adEditingId, { title: document.querySelector('#adTitle').value, text: document.querySelector('#adText').value, img: pendingAdImg });
        };
        im.src = e2.target.result;
      };
      rd.readAsDataURL(f0);
      return;
    }
    if (el.hasAttribute('data-feature-img')) {
      const f0 = el.files && el.files[0]; if (!f0) return;
      const rd = new FileReader();
      rd.onload = e2 => {
        const im = new Image();
        im.onload = () => {
          const ratio = Math.min(1, 900 / Math.max(im.width, im.height));
          const c = document.createElement('canvas');
          c.width = Math.round(im.width * ratio); c.height = Math.round(im.height * ratio);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          pendingFeatureImg = c.toDataURL('image/jpeg', 0.6);
          const t0 = document.querySelector('#fTitle').value, x0 = document.querySelector('#fText').value;
          openFeatureModal(featureEditingId, { title: t0, text: x0, img: pendingFeatureImg });
        };
        im.src = e2.target.result;
      };
      rd.readAsDataURL(f0);
      return;
    }
    if (el.id === 'logoInput') { handleLogo(el.files[0]); return; }
    if (el.id === 'importJson') {
      const f = el.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = ev => {
        try {
          const p = JSON.parse(ev.target.result);
          if (!p.sections || !p.branches) throw 0;
          db = p; save(); render(); toast('تم استيراد البيانات');
        } catch (err) { toast('ملف غير صالح', 'err'); }
      };
      r.readAsText(f);
    }
  });

  let draftSaveTimer = null;
  document.addEventListener('input', e => {
    const el = e.target;
    if (wiz && el && el.closest && el.closest('#wizBody')) {
      clearTimeout(draftSaveTimer);
      draftSaveTimer = setTimeout(() => { try { captureWizard(); } catch (err) { } }, 800);
    }
    if (el.id === 'adText') { const c = qs('#adCount'); if (c) c.textContent = el.value.length + ' / 1000'; }
    if (el.dataset.search) {
      const [g, k] = el.dataset.search.split('.');
      ui.filters[g][k] = el.value; ui.page = 1;
      const pos = el.selectionStart;
      render();
      const again = qs(`[data-search="${g}.${k}"]`);
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    }
    if (el.id === 'searchInput') runSearch(el.value);
    if (el.closest('#settingsForm')) {
      const dot = qs('#dirtyDot'), hint = qs('#saveHint');
      if (dot) dot.hidden = false;
      if (hint) hint.textContent = 'تغييرات غير محفوظة';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDrawer(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });

  const gs = qs('#globalSearch');
  if (gs) {
    gs.addEventListener('focus', () => openSearch());
    gs.addEventListener('keydown', e => { if (e.key === 'Enter') openSearch(e.target.value); });
  }

  function routeFromHash() {
    const raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return 'landing';
    const [path, rawId] = raw.split('/');
    const [cleanId, qs] = String(rawId || '').split('?');
    ui.qrMode = !!qs && qs.indexOf('qr=1') !== -1;
    if (path === 'audit' && cleanId) { ui.filters.auditId = decodeURIComponent(cleanId); return 'audit'; }
    if (path === 'report' && cleanId) {
      const bid = decodeURIComponent(cleanId);
      const br = db.branches.find(x => x.id === bid);
      ui.filters.report.branch = bid;
      if (br) { ui.filters.report.region = br.regionId; ui.filters.report.city = br.cityId; }
      return 'report';
    }
    return VIEWS[path] ? path : 'dashboard';
  }
  window.addEventListener('hashchange', async () => {
    const r = routeFromHash();
    if (r === 'audit' && ui.qrMode && !currentUser()) {
      const ok = await loadPublicAudit(ui.filters.auditId);
      if (ok) { ui.route = 'audit'; render(); return; }
      if (PUBLIC_LIMIT) { ui.route = 'qrdone'; render(); return; }
      toast('التقرير غير موجود', 'err');
    }
    ui.route = r; render();
  });

  /* ---------------- boot ---------------- */
  (function initReportPeriod(){
    const dates = db.audits.map(a => new Date(a.date + 'T00:00:00')).filter(d => !isNaN(d)).sort((x, y) => y - x);
    if (dates.length) {
      ui.filters.report.month = dates[0].getMonth();
      ui.filters.report.year = dates[0].getFullYear();
    }
  })();
  /* دخول تلقائي إذا المستخدم اختار «احفظني» */
  (function autoLogin() {
    if (sessionStorage.getItem('snam_session')) return;
    const r = rememberedUser();
    if (!r) return;
    const u = db.users.find(x => x.username === r.username && x.active !== false);
    if (u) { session = u.username; sessionStorage.setItem('snam_session', session); sessionStorage.setItem('snam_demo', u.role === 'demo' ? '1' : '0'); }
  })();
  ui.route = routeFromHash();
  (async () => {
    if (sbSession) {
      try {
        const data = await sbLoad();
        if (data) { const changed = mergeDb(data); ensureSettings(); if (changed) save(); }
      } catch (e) { }
    }
    if (!currentUser()) {
      if (ui.route === 'audit' && ui.qrMode) {
        const ok = await loadPublicAudit(ui.filters.auditId);
        if (ok) { render(); startMaintenanceWatcher(); return; }
        if (PUBLIC_LIMIT) { ui.route = 'qrdone'; render(); startMaintenanceWatcher(); return; }
      }
      const deep = (ui.route && ui.route !== 'landing') ? ui.route : null;
      ui.route = 'landing'; render();
      if (deep) { ui.pendingRoute = deep; openLogin(); }
    }
    else { render(); save(); try { sbDailyBackup(); } catch (e) { } }
    startMaintenanceWatcher();
    if (sbSession) setInterval(sbPoll, 20000);
  })();

  async function forceUpdateIfStale() {
    try {
      const r = await fetch('assets/app.js?ts=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return;
      const txt = await r.text();
      const m = txt.match(/APP_VERSION = '([^']+)'/);
      if (!m || m[1] === APP_VERSION) return;
      if (sessionStorage.getItem('snam_upd_' + m[1])) return;
      sessionStorage.setItem('snam_upd_' + m[1], '1');
      try { const keys = await caches.keys(); await Promise.all(keys.map(k => caches.delete(k))); } catch (e) { }
      try { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(x => x.unregister())); } catch (e) { }
      location.reload();
    } catch (e) { }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js?v=170', { updateViaCache: 'none' }).then(reg => {
        reg.update().catch(() => {});
      }).catch(() => {});
      setTimeout(forceUpdateIfStale, 1500);
    });
  } else {
    window.addEventListener('load', () => setTimeout(forceUpdateIfStale, 1500));
  }
})();
