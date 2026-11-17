/* ==========================================================================
   SNAM Quality — Seed data & domain model
   Hierarchy: Region → City → Branch
   Form: 6 axes / 94 items, each scored 0–4 (total 100)
   ========================================================================== */
(function () {
  'use strict';

  const DB_KEY = 'snam_qms_v8';

  /* ---------- Evaluation form (from the official PDF) ---------- */
  function q(id, text) { return { id, text, max: 4, active: true }; }

  const SECTIONS = [
    {
      id: 's1', name: 'نظافة وسلامة العاملين', group: null, order: 1, active: true,
      items: [
        q('s1-1', 'هل جميع الموظفين ملتزمون بغسل الأيدي وتعقيمها كل ساعة أو كلما اقتضت الحاجة؟'),
        q('s1-2', 'هل جميع الموظفين ملتزمون بقص الأظافر والشعر، وهل يتم خلع جميع الحلي والساعات قبل البدء بالعمل؟'),
        q('s1-3', 'هل جميع الموظفين ملتزمون بارتداء الزي الرسمي النظيف والمرتب والخالي من أي تمزق أو اهتراء؟'),
        q('s1-4', 'هل جميع الموظفين ملتزمون بارتداء القفازات والكمامة وغطاء الشعر والمريلة أثناء العمل وبالطريقة الصحيحة؟'),
        q('s1-5', 'هل توجد لوحات إرشادية عند مغسلة الأيدي توضح طريقة غسل الأيدي بالشكل الصحيح؟'),
        q('s1-6', 'هل يتوفر عند مغسلة الأيدي سائل تنظيف الأيدي ومعقم الأيدي والمناشف الورقية المعتمدة لغسل الأيدي؟'),
        q('s1-7', 'هل درجة حرارة الماء المستخدم في غسل الأيدي من ٣٨ إلى ٤٥ درجة مئوية؟'),
        q('s1-8', 'هل توجد أي أعراض مرضية على أي أحد من العاملين المتواجدين داخل المطعم؟'),
        q('s1-9', 'هل جميع الموظفين لديهم شهادات صحية سارية المفعول؟'),
        q('s1-10', 'هل يوجد صندوق للإسعافات الأولية ويحتوي على الإسعافات المطلوبة (شاش، قطن، كريم للحروق، مقص، لاصق أزرق)؟')
      ]
    },
    {
      id: 's2', name: 'سلامة الغذاء', group: null, order: 2, active: true,
      items: [
        q('s2-1', 'هل يتم رصد درجة حرارة المنتجات قبل الاستلام وتوثيقها في سجل الاستلام؟'),
        q('s2-2', 'هل درجة حرارة الثلاجات في المطعم من ١ إلى ٤ مئوي، وهل يتم توثيق رصدها بالشكل الصحيح؟'),
        q('s2-3', 'هل درجة حرارة الفريزرات في المطعم من −١٨ إلى −٢١ مئوي، وهل يتم توثيق رصدها بالشكل الصحيح؟'),
        q('s2-4', 'هل يتوفر جهاز لقياس درجات حرارة المنتجات ويعمل بكفاءة؟'),
        q('s2-5', 'هل الثلاجات والفريزرات خالية من أي روائح كريهة أو صدأ أو أي علامات عفن؟'),
        q('s2-6', 'هل يتم تخزين المنتجات داخل الثلاجات والفريزرات بشكل منفصل حسب تعليمات التشغيل لتفادي أي تلوث غذائي؟'),
        q('s2-7', 'هل توجد تواريخ صلاحية على جميع المنتجات المستخدمة حسب تعليمات التشغيل؟'),
        q('s2-8', 'هل يتم استخدام أي منتجات منتهية الصلاحية في عمليات التشغيل؟'),
        q('s2-9', 'هل هناك أي تلاعب في تواريخ الصلاحية للمنتجات المستخدمة في التشغيل؟'),
        q('s2-10', 'هل توجد أي علامات للتلوث الفيزيائي للمنتجات المستخدمة (الرائحة، اللون، الشكل)؟'),
        q('s2-11', 'هل جميع المنتجات المستخدمة مغطاة ومحكمة الإغلاق لتفادي أي تلوث غذائي؟'),
        q('s2-12', 'هل الأدوات المستخدمة (قدور، سكاكين، ألواح تقطيع، مغارف، أدوات سكب وغيرها) خالية من الصدأ والكسور وطبقًا للمعايير؟'),
        q('s2-13', 'هل يتم غسل وتعقيم الأدوات المستخدمة قبل الاستخدام حسب تعليمات التشغيل؟'),
        q('s2-14', 'هل يتم تعقيم الأسطح المستخدمة في غرف التحضير ومنطقة الطبخ والاستلام بعد كل استخدام أو عندما تقتضي الحاجة؟'),
        q('s2-15', 'هل يتم تعقيم الخضار قبل الاستخدام حسب تعليمات التشغيل؟'),
        q('s2-16', 'هل الأرز الجاهز للاستخدام (المغسول) مغطى بشكل دائم بعد كل استخدام؟'),
        q('s2-17', 'هل يتم تخزين أو حفظ المنتجات المبردة أو المجمدة خارج الثلاجات أو الفريزرات بشكل مخالف لتعليمات التشغيل؟'),
        q('s2-18', 'هل درجة حرارة المستودع من ٢٠ إلى ٢٥ مئوي ويتم رصدها بشكل دوري بالكشف الخاص بها؟'),
        q('s2-19', 'هل يتم تطبيق جميع اشتراطات التخزين للمواد المخزنة: الارتفاع عن الأرض ١٥ سم، والمسافة من الحوائط ٥ سم، والمسافة بين المنتجات على الأرفف ٥ سم؟'),
        q('s2-20', 'هل يتم تخزين الأرز بالمستودع على قواعد بلاستيكية؟'),
        q('s2-21', 'هل يتم تطبيق قاعدة FIFO (الوارد أولًا يُصرف أولًا) مع مراعاة تاريخ انتهاء المنتج؟'),
        q('s2-22', 'هل يتوفر مصائد للقوارض؟'),
        q('s2-23', 'هل توجد أي علامات لوجود حشرات أو قوارض داخل المطعم؟'),
        q('s2-24', 'هل تتوفر تقارير عن زيارات شركات مكافحة الحشرات (كل ٣٠ يومًا على الأقل)؟')
      ]
    },
    {
      id: 's3', name: 'جودة المنتجات', group: null, order: 3, active: true,
      items: [
        q('s3-1', 'هل جميع المنتجات المستخدمة (لحوم، دجاج، ألبان، أرز، مياه الشرب، كشنة وغيرها) من الموردين المعتمدين لدى شركة حاشي باشا؟'),
        q('s3-2', 'هل جميع تعليمات التشغيل متوفرة بالفرع وواضحة لكل العاملين بالمطعم؟'),
        q('s3-3', 'هل درجة حرارة المنتج النهائي أعلى من ٦١ درجة مئوية؟'),
        q('s3-4', 'هل يتم تقديم المنتجات النهائية حسب الترتيب والشكل طبقًا لمعايير تشغيل الشركة؟'),
        q('s3-5', 'هل أوزان ومواصفات الدجاج المستخدم في المنتج النهائي مطابقة لمواصفات شركة حاشي باشا (٨٠٠ غم للمضغوط و٩٠٠ غم للشواية)؟'),
        q('s3-6', 'هل أوزان ومواصفات اللحم المستخدم في المنتج النهائي مطابقة لمواصفات شركة حاشي باشا (١٨٠٠ غم للكيس وبنسبة عظم لا تتجاوز ٢٠٪)؟'),
        q('s3-7', 'هل يتم استخدام الكشنة طبقًا للمعيار المعتمد حسب سياسة التشغيل في المنتجات النهائية؟'),
        q('s3-8', 'هل يتم استلام الخضار حسب المعايير والمواصفات المتفق عليها؟'),
        q('s3-9', 'هل يتم إحكام إغلاق وتغطية الخضار المقطعة لضمان جودتها؟'),
        q('s3-10', 'هل توجد تواريخ صلاحية سارية المفعول على فلتر الماء؟')
      ]
    },
    {
      id: 's4', name: 'خدمة العملاء', group: 'الخدمات', order: 4, active: true,
      items: [
        q('s4-1', 'هل المضيف أو الكاشير يرتدي الزي الرسمي مع الشعار، ويجب أن يكون نظيفًا ومرتبًا ويحمل بطاقة التعريف باسمه؟'),
        q('s4-2', 'هل يقوم المضيف أو الكاشير بالترحيب والابتسام للعميل عند دخوله؟'),
        q('s4-3', 'عند أخذ الطلب من العميل، هل يقوم المضيف أو الكاشير بالاستماع بشكل دقيق لطلب العميل مع الحفاظ على التواصل البصري معه؟'),
        q('s4-4', 'هل يقوم المضيف أو الكاشير بعرض الأصناف الجديدة والأطباق الجانبية والحلي للعميل؟'),
        q('s4-5', 'بعد الانتهاء من أخذ الطلب، هل يقوم الكاشير أو المضيف بمراجعة ما قام العميل بطلبه من أجل التأكيد عليه؟'),
        q('s4-6', 'قبل الدفع، هل قام الكاشير بإبلاغ العميل بقيمة طلبه وهل سأله إن كان طلبه محليًا أم سفريًا؟'),
        q('s4-7', 'هل قام الكاشير أو المضيف بإعطاء فاتورة واضحة وبنفس المبلغ المدفوع للعميل؟'),
        q('s4-8', 'هل يقوم موظف تسليم الطلبات بتوفير (٢ سلطة حارة، كيس ليمون، بصل مقطع، مفرش سفرة، وعدد ٢ ملاعق لكل ½ دجاج أو ١ حاشي)؟'),
        q('s4-9', 'هل يقوم موظف تسليم الطلبات بالنداء على الطلب الجاهز بصوت يسمعه العملاء؟'),
        q('s4-10', 'هل يقوم موظف تسليم الطلبات للعملاء مع الابتسامة وقول «بالعافية ونراكم مرة أخرى»؟'),
        q('s4-11', 'هل جميع شاشات قائمة الطعام تعمل ونظيفة؟'),
        q('s4-12', 'هل أسعار قائمة الطعام مطابقة ولا يوجد بها اختلاف عن الأسعار المحددة من الشركة؟'),
        q('s4-13', 'هل كل الأصناف الموجودة على قائمة الطعام متوفرة لدى الفرع؟'),
        q('s4-14', 'هل كاونتر الكاش نظيف ومرتب ولا يحتوي إلا على المواد الدعائية للصنف الجديد فقط؟'),
        q('s4-15', 'هل كل المواد الدعائية المستخدمة بالفرع جديدة ومتوافقة مع الحملة الدعائية الموضوعة؟'),
        q('s4-16', 'هل جميع سجلات ورخص البلدية للفرع موجودة وسارية الصلاحية؟')
      ]
    },
    {
      id: 's5', name: 'المظهر العام للمطعم', group: 'النظافة', order: 5, active: true,
      items: [
        q('s5-1', 'هل أرضيات المواقف والأرصفة لمدخل المطعم نظيفة وخالية من أي بقع للزيوت؟'),
        q('s5-2', 'هل اللوحات الدعائية سليمة ونظيفة والألوان فيها واضحة وتعمل بشكل سليم؟'),
        q('s5-3', 'هل زجاج وأبواب المطعم نظيفة وخالية من أي بصمات وتعمل بشكل جيد؟'),
        q('s5-4', 'هل حاويات البلدية وبراميل النفايات نظيفة وسليمة وموضوعة بالأماكن المخصصة لها؟'),
        q('s5-5', 'هل أرصفة مدخل المطعم سليمة وخالية من العيوب؟')
      ]
    },
    {
      id: 's6', name: 'النظافة العامة وصيانة المعدات', group: 'النظافة', order: 6, active: true,
      items: [
        q('s6-1', 'هل الأرضيات والجدران والأسقف في صالة الإنتاج نظيفة وخالية من أي تشقق أو كسور أو ثقوب؟'),
        q('s6-2', 'هل الثلاجات والفريزرات نظيفة من الداخل والخارج وتعمل بكفاءة؟'),
        q('s6-3', 'هل الأرفف سليمة وخالية من الصدأ والتقشرات ونظيفة؟'),
        q('s6-4', 'هل جميع طاولات التحضير سليمة وخالية من الصدأ ونظيفة؟'),
        q('s6-5', 'هل جميع أحواض الغسيل والمغاسل سليمة ونظيفة وتعمل بشكل جيد؟'),
        q('s6-6', 'هل مغسلة أيدي الموظفين سليمة ونظيفة وداخل المطعم؟'),
        q('s6-7', 'هل صفايات الصرف الصحي نظيفة ومغطاة ولا يوجد فيها أو حولها أي كسور؟'),
        q('s6-8', 'هل براميل النفايات مغلقة ونظيفة وتعمل باستخدام القدم وبعيدة عن مناطق تجهيز الطعام؟'),
        q('s6-9', 'هل الإضاءة سليمة ومؤمنة وتعمل بكفاءة؟'),
        q('s6-10', 'هل مصائد الحشرات (الجدارية) متوفرة ونظيفة وتعمل بكفاءة؟'),
        q('s6-11', 'هل يتوفر ميزان أوزان سليم ويعمل بكفاءة؟'),
        q('s6-12', 'هل يتوفر ماء ساخن لغسل الأواني في حوض الغسيل؟')
      ]
    },
    {
      id: 's7', name: 'النظافة العامة لصالة المحلي', group: 'النظافة', order: 7, active: true,
      items: [
        q('s7-1', 'هل رائحة صالة المحلي والسفري جيدة ولا توجد روائح كريهة؟'),
        q('s7-2', 'هل الأرضيات والجدران والأسقف والستائر في صالة الطعام نظيفة وخالية من أي تشقق أو كسور؟'),
        q('s7-3', 'هل الجلسات في صالة الطعام نظيفة وخالية من أي بقايا للطعام وخالية من التكسر ويتوفر فيها مناديل؟'),
        q('s7-4', 'هل مصائد الحشرات نظيفة وتعمل باستمرار وبعيدة عن الجلسات؟'),
        q('s7-5', 'هل ستائر الهواء للباب الرئيسي نظيفة وتعمل بكفاءة؟'),
        q('s7-6', 'هل أجهزة التكييف تعمل ويتم ضبطها على حرارة ٢٢–٢٤ مئوي؟'),
        q('s7-7', 'هل الإضاءة في صالة الطعام سليمة ومؤمنة وتعمل بكفاءة؟'),
        q('s7-8', 'هل دورات المياه والمغاسل نظيفة ولا يوجد روائح كريهة ويتوفر فيها الصابون والمناديل؟')
      ]
    },
    {
      id: 's8', name: 'السلامة المهنية', group: null, order: 8, active: true,
      items: [
        q('s8-1', 'هل الكاميرات تعمل بشكل سليم وبوضوح، وهل عدد الكاميرات بالفرع حسب العدد المطلوب (على الأقل ٥ كاميرات)؟'),
        q('s8-2', 'هل السيرفر يعمل ونظيف؟'),
        q('s8-3', 'هل يتوفر مخارج للطوارئ وإنارات طوارئ؟'),
        q('s8-4', 'هل أجهزة الحريق والطفايات موجودة وضمن متطلبات السلامة العامة وبتواريخ سارية المفعول؟'),
        q('s8-5', 'هل منطقة الارتداد مؤمنة ونظيفة؟'),
        q('s8-6', 'هل يتوفر خزانات للغاز نظيفة ومؤمنة وتعمل بكفاءة ولا يتم استخدام أسطوانات الغاز لأي غرض آخر؟'),
        q('s8-7', 'هل مصائد الزيوت موجودة ونظيفة وتعمل بكفاءة؟'),
        q('s8-8', 'هل كل الأرضيات في منطقة الارتداد خالية من الأوساخ والزيوت؟'),
        q('s8-9', 'هل تتوفر جميع أدوات التنظيف طبقًا للمعايير (مكانس، دلاء المساح، مساحات الأرضيات)، وهل الأدوات نظيفة وخالية من الكسور؟')
      ]
    }
  ];

  /* ---------- Visit types ---------- */
  const VISIT_TYPES = {
    daily:     { key: 'daily',     name: 'يومية',   short: 'يومي',  perYear: 0,  cycleMonths: 0,  color: '#3E7C59' },
    weekly:    { key: 'weekly',    name: 'أسبوعية', short: 'أسبوعي', perYear: 48, cycleMonths: 0,  color: '#2B5F86' },
    monthly:   { key: 'monthly',   name: 'شهرية',  short: 'شهري',  perYear: 12, cycleMonths: 1,  color: '#6E1220' },
    quarterly: { key: 'quarterly', name: 'فصلية',  short: 'فصلي',  perYear: 3,  cycleMonths: 4,  color: '#8A7434' },
    annual:    { key: 'annual',    name: 'سنوية',  short: 'سنوي',  perYear: 1,  cycleMonths: 12, color: '#2F7D5B' }
  };

  /* ---------- Regions ---------- */
  const REGIONS = [
    { id: 'r-central', name: 'الوسطى',   color: '#6E1220', order: 1 },
    { id: 'r-south',   name: 'الجنوبية', color: '#2F7D5B', order: 2 },
    { id: 'r-east',    name: 'الشرقية',  color: '#2B5F86', order: 3 },
    { id: 'r-west',    name: 'الغربية',  color: '#8A7434', order: 4 },
    { id: 'r-north',   name: 'الشمالية', color: '#7A4E7E', order: 5 }
  ];

  /* ---------- Cities ---------- */
  const CITIES = [
    // الوسطى
    ['ct-riyadh','الرياض','r-central'],['ct-diriyah','الدرعية','r-central'],['ct-kharj','الخرج','r-central'],
    ['ct-majmaah','المجمعة','r-central'],['ct-zulfi','الزلفي','r-central'],['ct-shaqra','شقراء','r-central'],
    ['ct-dawadmi','الدوادمي','r-central'],['ct-wadi','وادي الدواسر','r-central'],['ct-aflaj','الأفلاج','r-central'],
    ['ct-hawtat','حوطة بني تميم','r-central'],['ct-quwaiyah','القويعية','r-central'],['ct-afif','عفيف','r-central'],
    ['ct-ghat','الغاط','r-central'],['ct-thadiq','ثادق','r-central'],['ct-huraymila','حريملاء','r-central'],
    ['ct-rumah','رماح','r-central'],['ct-marat','مرات','r-central'],['ct-durma','ضرما','r-central'],
    ['ct-muzahimiyah','المزاحمية','r-central'],

    // الجنوبية
    ['ct-abha','أبها','r-south'],['ct-khamis','خميس مشيط','r-south'],['ct-bishah','بيشة','r-south'],
    ['ct-namas','النماص','r-south'],['ct-tanomah','تنومة','r-south'],['ct-mahayel','محايل عسير','r-south'],
    ['ct-rijal','رجال ألمع','r-south'],['ct-dhahran-janoub','ظهران الجنوب','r-south'],['ct-sarat','سراة عبيدة','r-south'],
    ['ct-tathlith','تثليث','r-south'],['ct-jazan','جيزان','r-south'],['ct-sabya','صبيا','r-south'],
    ['ct-samtah','صامطة','r-south'],['ct-abu-arish','أبو عريش','r-south'],['ct-baysh','بيش','r-south'],
    ['ct-farasan','فرسان','r-south'],['ct-aridah','العارضة','r-south'],['ct-masarha','أحد المسارحة','r-south'],
    ['ct-bahah','الباحة','r-south'],['ct-baljurashi','بلجرشي','r-south'],['ct-mandaq','المندق','r-south'],
    ['ct-makhwah','المخواة','r-south'],['ct-najran','نجران','r-south'],['ct-sharurah','شرورة','r-south'],
    ['ct-habouna','حبونا','r-south'],['ct-badr-janoub','بدر الجنوب','r-south'],

    // الشرقية
    ['ct-dammam','الدمام','r-east'],['ct-khobar','الخبر','r-east'],['ct-dhahran','الظهران','r-east'],
    ['ct-ahsa','الأحساء','r-east'],['ct-qatif','القطيف','r-east'],['ct-jubail','الجبيل','r-east'],
    ['ct-hafr','حفر الباطن','r-east'],['ct-khafji','الخفجي','r-east'],['ct-ras-tanura','رأس تنورة','r-east'],
    ['ct-bqeeq','بقيق','r-east'],['ct-nuayriyah','النعيرية','r-east'],['ct-qaryat','قرية العليا','r-east'],

    // الغربية
    ['ct-jeddah','جدة','r-west'],['ct-makkah','مكة المكرمة','r-west'],['ct-madinah','المدينة المنورة','r-west'],
    ['ct-taif','الطائف','r-west'],['ct-yanbu','ينبع','r-west'],['ct-rabigh','رابغ','r-west'],
    ['ct-khulais','خليص','r-west'],['ct-jumum','الجموم','r-west'],['ct-lith','الليث','r-west'],
    ['ct-qunfudhah','القنفذة','r-west'],['ct-ula','العلا','r-west'],['ct-badr','بدر','r-west'],
    ['ct-khaybar','خيبر','r-west'],['ct-hanakiyah','الحناكية','r-west'],['ct-mahd','المهد','r-west'],

    // الشمالية
    ['ct-tabuk','تبوك','r-north'],['ct-hail','حائل','r-north'],['ct-sakaka','سكاكا','r-north'],
    ['ct-arar','عرعر','r-north'],['ct-qurayyat','القريات','r-north'],['ct-dumat','دومة الجندل','r-north'],
    ['ct-tubarjal','طبرجل','r-north'],['ct-wajh','الوجه','r-north'],['ct-duba','ضباء','r-north'],
    ['ct-haql','حقل','r-north'],['ct-umluj','أملج','r-north'],['ct-bada','البدع','r-north'],
    ['ct-tayma','تيماء','r-north'],['ct-rafha','رفحاء','r-north'],['ct-uwayqilah','العويقيلة','r-north'],
    ['ct-baqaa','بقعاء','r-north']
  ].map(([id, name, regionId]) => ({ id, name, regionId }));

  /* ---------- Branches ---------- */
  const BRANCHES = [
    { id: 'b13', code: 'SN-013', name: 'حاشي باشا جيزان — مخطط ٥', cityId: 'ct-jazan', regionId: 'r-south', manager: 'محمد مصطفى عسكر', phone: '017 322 1100', opened: '2021-04-07', seats: 108, address: 'مخطط ٥، طريق الملك فهد، جيزان' }
  ];

  const SETTINGS = {
    companyName: 'شركة سنام الرائدة',
    tagline: 'المشغلة لمطاعم شركة حاشي باشا',
    serviceName: 'نظام الجودة',
    serviceDesc: 'إدارة الزيارات الرقابية وتقييم الفروع وخطط التحسين',
    phone: '+966 11 000 0000',
    whatsapp: '',
    email: 'quality@snam.sa',
    website: 'www.snam.sa',
    address: 'الرياض — حي الرمال، طريق الثمامة',
    hq: 'الرياض، المملكة العربية السعودية',
    workHours: 'الأحد – الخميس، 8:00 ص – 5:00 م',
    passScore: 85,
    warnScore: 70,
    qualityManagerName: 'بندر بن مروعي محمد',
    qualityManagerTitle: 'مدير الجودة — المنطقة الجنوبية',
    supervisorName: 'المشرف العام لشركة سنام',
    supervisorPersonName: '',
    logo: 'assets/brand/snam-logo-gold.png',
    logoLight: 'assets/brand/snam-logo-white.png',
    year: 2026
  };

  /* ---------- Users & roles ---------- */
  const PASS_HASH = '971da62f4359b52cbdbeb0f3d82203be234e0dc82349f7192ccb491ff74dbf62'; // Snam@2026

  const USERS = [
    { id: 'u1',  name: 'بندر بن مروعي محمد',  username: 'bandar',     role: 'quality_manager',    regionId: 'r-south',   active: true,  pass: PASS_HASH },
    { id: 'u2',  name: '',                 username: 'q.central',  role: 'quality_manager',    regionId: 'r-central', active: false, pass: PASS_HASH },
    { id: 'u3',  name: '',                 username: 'q.east',     role: 'quality_manager',    regionId: 'r-east',    active: false, pass: PASS_HASH },
    { id: 'u4',  name: '',                 username: 'q.west',     role: 'quality_manager',    regionId: 'r-west',    active: false, pass: PASS_HASH },
    { id: 'u5',  name: '',                 username: 'q.north',    role: 'quality_manager',    regionId: 'r-north',   active: false, pass: PASS_HASH },

    { id: 'u6',  name: 'ياسر أبو القاسم',  username: 'yaser',      role: 'ops_manager',        regionId: 'r-south',   active: true,  pass: PASS_HASH },
    { id: 'u7',  name: 'محمد أحمد',        username: 'mohammed',   role: 'ops_manager',        regionId: 'all',       active: true,  pass: PASS_HASH },
    { id: 'u8',  name: '',                 username: 'o.central',  role: 'ops_supervisor',     regionId: 'r-central', active: false, pass: PASS_HASH },
    { id: 'u9',  name: '',                 username: 'o.east',     role: 'ops_supervisor',     regionId: 'r-east',    active: false, pass: PASS_HASH },
    { id: 'u10', name: '',                 username: 'o.west',     role: 'ops_supervisor',     regionId: 'r-west',    active: false, pass: PASS_HASH },
    { id: 'u11', name: '',                 username: 'o.north',    role: 'ops_supervisor',     regionId: 'r-north',   active: false, pass: PASS_HASH },

    { id: 'u12', name: 'أحمد بركات',       username: 'ahmed.b',    role: 'training_manager',   regionId: 'all',       active: true,  pass: PASS_HASH },
    { id: 'u13', name: '',                 username: 'ceo',        role: 'ceo',                regionId: 'all',       active: true,  pass: PASS_HASH },
    { id: 'u14', name: '',                 username: 'gm',         role: 'general_manager',    regionId: 'all',       active: false, pass: PASS_HASH },
    { id: 'u15', name: '',                 username: 'exec',       role: 'general_supervisor', regionId: 'all',       active: true,  pass: PASS_HASH },

    { id: 'u16', name: 'مدير المنصة',      username: 'admin',      role: 'admin',              regionId: 'all',       active: true,  pass: '612521dcc2df984f4430fbe1eb97c9585b48b791f4ea6f5c707c6687cd0213f4' },
    { id: 'u17', name: 'الدعم الفني',      username: 'support',    role: 'support',            regionId: 'all',       active: true,  pass: PASS_HASH },
    { id: 'u18', name: 'مدير المنطقة الجنوبية', username: 'south',  role: 'regional_manager',   regionId: 'r-south',   active: true,  pass: PASS_HASH },
    { id: 'u19', name: 'مدير المنطقة الشمالية', username: 'north',  role: 'regional_manager',   regionId: 'r-north',   active: true,  pass: PASS_HASH },
    { id: 'u18', name: 'المحاسب المالي',   username: 'accountant', role: 'accountant',         regionId: 'all',       active: true,  pass: PASS_HASH },
    { id: 'u19', name: 'حساب تجريبي',      username: 'demo',       role: 'demo',               regionId: 'all',       active: true,  pass: PASS_HASH }
  ];

  const ROLES = {
    hr: 'الموارد البشرية',
    quality_manager: 'مدير الجودة',
    branch_manager: 'مدير فرع',
    ops_manager: 'مدير المنطقة',
    ops_supervisor: 'مشرف التشغيل',
    regional_manager: 'مدير المنطقة (مسار الاعتماد)',
    training_manager: 'مدير التدريب والتطوير',
    ceo: 'المدير التنفيذي',
    general_manager: 'المدير العام',
    general_supervisor: 'المشرف العام',
    admin: 'مدير لوحة التحكم',
    support: 'الدعم الفني',
    accountant: 'المحاسب المالي',
    demo: 'حساب تجريبي'
  };

  /* ---------- Utilities ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const pad = n => String(n).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  const TOTAL_POINTS = 100;

  function scoreAudit(items) {
    let got = 0, max = 0;
    SECTIONS.forEach(sec => sec.items.forEach(it => {
      if (it.active === false) return;
      max += it.max;
      got += items[it.id] == null ? it.max : items[it.id];
    }));
    const pct = max ? got / max * 100 : 0;
    return { got, max, pct, overall: Math.round(pct), points: Math.round(pct / 100 * TOTAL_POINTS * 10) / 10 };
  }

  /* ---------- Generate history ---------- */
  function seed() {
    const rnd = mulberry32(20261106);
    const audits = [];
    const findings = [];
    const year = 2026;
    const TODAY = new Date(2026, 10, 6);

    const jazan = BRANCHES[0];
    const items = {};
    const ids = [];
    SECTIONS.forEach(sec => sec.items.forEach(it => { items[it.id] = 4; ids.push(it.id); }));
    for (let k = 0; k < 30; k++) items[ids[(k * 7 + 3) % ids.length]] = 2;
    const t = scoreAudit(items);

    const audit = {
      id: 'AU-0001-JZ',
      branchId: jazan.id,
      type: 'monthly',
      date: '2026-10-18',
      auditor: 'بندر مروعي',
      items,
      got: t.got, max: t.max, overall: t.overall,
      status: 'متابعة مطلوبة',
      approval: 'approved',
      approvedBy: 'بندر بن مروعي محمد', approvedAt: '2026-10-19',
      finalBy: 'المشرف العام', finalAt: '2026-10-21', finalTime: '٠٩:٤٥ ص',
      notes: 'تقييم إدارة التشغيل والجودة الدوري — أكتوبر ٢٠٢٦. زيارة ميدانية شاملة على ٩٤ بندًا، والدرجة النهائية ٨٤ من ١٠٠.',
      recommendations: 'معالجة الملاحظات المرصودة في المحاور الأدنى (النظافة العامة وصيانة المعدات، والسلامة المهنية)، وإعادة الزيارة للتحقق خلال أسبوعين.',
      photos: {}, itemNotes: {}
    };
    audits.push(audit);

    let fi = 0;
    SECTIONS.forEach(sec => sec.items.forEach(it => {
      const v = items[it.id];
      if (v > 2) return;
      const sev = v === 0 ? 'حرج' : v === 1 ? 'عالي' : 'متوسط';
      findings.push({
        id: 'F-' + String(++fi).padStart(4, '0'),
        auditId: audit.id, branchId: jazan.id,
        sectionId: sec.id, sectionName: sec.name, itemId: it.id,
        title: it.text, severity: sev, status: 'مفتوح', owner: jazan.manager,
        due: iso(addDays(new Date(2026, 9, 18), sev === 'حرج' ? 3 : sev === 'عالي' ? 7 : 14)),
        action: '', createdAt: '2026-10-18', closedAt: ''
      });
    }));

    audits.sort((a, b) => b.date.localeCompare(a.date));
    return {
      settings: { ...SETTINGS },
      regions: REGIONS.map(r => ({ ...r })),
      cities: CITIES.map(c => ({ ...c })),
      branches: BRANCHES.map(b => ({ ...b })),
      sections: JSON.parse(JSON.stringify(SECTIONS)),
      audits, findings,
      users: USERS.map(u => ({ ...u })),
      visitTypes: VISIT_TYPES
    };
  }

  /* ===== بنود تقييم مدير الفرع (30 بندًا × 5 = 150) ===== */
  const BM_SECTIONS = [
    { id: 'bm1', name: "سلامة الغذاء وسلامة المخزون وصحة التخزين", order: 1, active: true, items: [
      { id: 'bm1-1', text: "متابعة درجات الحرارة بواقعية ومطابقة الأرقام المسجلة مع الترمومتر (المبرد والمجمد والجاف)", max: 5, active: true },
      { id: 'bm1-2', text: "متابعة تواريخ صلاحية المنتجات (الفريش + طويلة المدى + طويلة المدى المفتوحة)", max: 5, active: true },
      { id: 'bm1-3', text: "سلامة المخزون وصحة التخزين", max: 5, active: true },
      { id: 'bm1-4', text: "نظافة العمال الشخصية ومنع التلوث", max: 5, active: true },
      { id: 'bm1-5', text: "تطبيق قاعدة FIFO والتأكد من صحة دوران المنتجات", max: 5, active: true },
    ] },
    { id: 'bm2', name: "النظافة والتعقيم", order: 2, active: true, items: [
      { id: 'bm2-1', text: "التأكد من إتباع معايير نظافة المطعم الخارجية (مواقف السيارات - اللوحة - الزجاج الخارجي - الزرع - إلخ)", max: 5, active: true },
      { id: 'bm2-2', text: "التأكد من إتباع معايير النظافة الداخلية للمطعم (المحطات - المخزن - الثلاجات - الأدوات والمعدات - الأرضيات - الجدران - الأهواد - منطقة غسيل الصحون - إلخ)", max: 5, active: true },
      { id: 'bm2-3', text: "التأكد من إتباع معايير نظافة منطقة الخدمات (الحمامات - المغاسل - منطقة الكاشير - صالة الطعام)", max: 5, active: true },
      { id: 'bm2-4', text: "التأكد من التزام الموظفين بارتداء الزي الموحد والنظافة الشخصية ووجود بطاقة التعريف بالموظف", max: 5, active: true },
      { id: 'bm2-5', text: "تفعيل جدول النظافة ومتابعته", max: 5, active: true },
    ] },
    { id: 'bm3', name: "الالتزام بالمعايير والتشغيل السليم", order: 3, active: true, items: [
      { id: 'bm3-1', text: "التأكد من إعداد جميع المنتجات طبقاً لمعايير التشغيل (مضغوط - كبسة - إيدامات - سلطات - حلى)", max: 5, active: true },
      { id: 'bm3-2', text: "التأكد من جودة المنتج النهائي المقدم للعملاء ومطابقته للمواصفات (الكمية - الوزن - تجانس اللون - الطعم - إلخ)", max: 5, active: true },
      { id: 'bm3-3', text: "سرعة الخدمة (قياس زمن خدمة 10 طلبات - متوسط زمن الخدمة 5 دقائق داخل المطعم و20 دقيقة لخدمة التوصيل)", max: 5, active: true },
      { id: 'bm3-4', text: "موظف الكاشير: يبتسم وأخلاقه حسنة، متفاعل، يعرض باحترافية، يضبط التعامل مع النقود، مهتم بالكاشير لا يعبث أو يغفل عن الزبائن", max: 5, active: true },
      { id: 'bm3-5', text: "استطلاع آراء العملاء داخل المطعم وانطباع زيارتهم للمطعم (5 عملاء على الأقل)", max: 5, active: true },
      { id: 'bm3-6', text: "عمل اجتماع فردي أو جماعي مع الموظفين لشرح الأهداف وتعليمات التشغيل لكل موظف", max: 5, active: true },
    ] },
    { id: 'bm4', name: "إدارة المخزون والهدر", order: 4, active: true, items: [
      { id: 'bm4-1', text: "متابعة الطلبيات المختلفة لجميع الموردين وضبط مقدارها، والتأكد من توافر جميع الخامات المستخدمة خلال اليوم", max: 5, active: true },
      { id: 'bm4-2', text: "صحة حفظ المنتج والالتزام بالإجراءات الصحيحة", max: 5, active: true },
      { id: 'bm4-3', text: "عدم تبييت المنتج (قدور لحم الحاشي - قدور الدجاج - الإيدامات - السلطات)", max: 5, active: true },
      { id: 'bm4-4', text: "تقليل الهدر: استخدام كمية أكبر من اللازم أثناء التشغيل", max: 5, active: true },
      { id: 'bm4-5', text: "انعدام الفاقد: مادة أو منتج خرج من المخزون ولم يعد صالحاً للاستخدام أو البيع، أو اختفى دون مبرر", max: 5, active: true },
    ] },
    { id: 'bm5', name: "السلامة ومتابعة الصيانة", order: 5, active: true, items: [
      { id: 'bm5-1', text: "الغاز وتأمينه، الكهرباء، المعدات بشكل عام، مخارج الطوارئ، مجاري الصرف، متابعة نظافة غرفة الزيت، الإبلاغ عن أعطال الصيانة مع متابعة الإصلاح أولاً بأول", max: 5, active: true },
    ] },
    { id: 'bm6', name: "الرقابة على الموظفين", order: 6, active: true, items: [
      { id: 'bm6-1', text: "الحضور والانصراف، الزي والنظافة الشخصية، متابعة سلوكه مع الموظفين ومع الزبائن، القيام بالمهام، التدريب على أكثر من محطة", max: 5, active: true },
      { id: 'bm6-2', text: "متابعة موظف التوصيل (نظافة ملابسه - بطاقة التعريف - نظافة السيارة - وقت التوصيل)", max: 5, active: true },
    ] },
    { id: 'bm7', name: "إدارة وتصحيح الملاحظات السابقة", order: 7, active: true, items: [
      { id: 'bm7-1', text: "تقبل التوجيهات، سرعة معالجة الخطأ، منع تكرارها، توثيق التصحيح بالصور، متابعة التصحيح حتى إغلاق الملاحظة", max: 5, active: true },
    ] },
    { id: 'bm8', name: "القيادة وثقافة العمل بأعلى درجات الجودة", order: 8, active: true, items: [
      { id: 'bm8-1', text: "التزام المدير بالحضور وقت الدوام، قدوة المدير، متابعته الجودة والتشغيل السليم، ترسيخ قاعدة ثقافة التصحيح عند موظفيه، التعامل الحسن مع الزبائن والموظفين", max: 5, active: true },
      { id: 'bm8-2', text: "متابعة (هدف المبيعات اليومي على مدار الساعة + هدف الأصناف الجانبية + هدف تارجت التوصيل) وبث ثقافة العمل الجماعي بين الموظفين لرفع مستوى الربح", max: 5, active: true },
      { id: 'bm8-3', text: "متابعة الجرد اليومي للمنتجات ومقارنته مع ريفل، والقيام بالمهام النقدية: تسليم عهدة الكاشير - جرد الخزينة", max: 5, active: true },
      { id: 'bm8-4', text: "قراءة دفتر التواصل وتسجيل الملاحظات بشكل دوري", max: 5, active: true },
      { id: 'bm8-5', text: "المدير قادر على إدارة العمل والموظفين بشكل جيد", max: 5, active: true },
    ] },
  ];

  /* ===== بنود زيارة الجرد (بدون درجات — حقول تُدخل وتُعدّل) ===== */
  const INV_SECTIONS = [
    { id: 'inv1', name: "بيانات الزيارة", order: 1, active: true,
      items: [
        { id: 'inv1-1', text: "اسم مسؤول الجرد", type: 'text', max: 0, active: true },
        { id: 'inv1-2', text: "مدير الفرع", type: 'text', max: 0, active: true },
        { id: 'inv1-3', text: "وقت بداية الجرد", type: 'time', max: 0, active: true },
        { id: 'inv1-4', text: "وقت نهاية الجرد", type: 'time', max: 0, active: true },
        { id: 'inv1-5', text: "الوردية", type: 'select', max: 0, active: true, options: ["صباحية", "مسائية", "إغلاق"] },
        { id: 'inv1-6', text: "رقم الزيارة", type: 'text', max: 0, active: true },
      ] },
    { id: 'inv2', name: "المبيعات والصندوق", order: 2, active: true,
      items: [
        { id: 'inv2-1', text: "إجمالي مبيعات النظام", type: 'money', max: 0, active: true },
        { id: 'inv2-2', text: "مبيعات الكاش", type: 'money', max: 0, active: true },
        { id: 'inv2-3', text: "مبيعات الشبكة", type: 'money', max: 0, active: true },
        { id: 'inv2-4', text: "تطبيقات التوصيل", type: 'money', max: 0, active: true },
        { id: 'inv2-5', text: "المصروفات النقدية المعتمدة", type: 'money', max: 0, active: true },
        { id: 'inv2-6', text: "النقدية الفعلية بالصندوق", type: 'money', max: 0, active: true },
        { id: 'inv2-7', text: "ملاحظات الفرق", type: 'text', max: 0, active: true },
      ] },
    { id: 'inv3', name: "تحليل مشاكل الجرد", order: 3, active: true,
      rows: true, cols: ["الصنف", "رصيد أول اليوم", "الوارد", "المستخدم", "الهدر", "الرصيد النظري", "الرصيد الفعلي", "الفرق"],
      items: [
      ] },
    { id: 'inv4', name: "الهدر والتالف", order: 4, active: true,
      rows: true, cols: ["الصنف", "الكمية", "السبب", "القيمة التقديرية", "الإجراء"],
      items: [
        { id: 'inv4-1', text: "تم توثيق الهدر بالصور", type: 'bool', max: 0, active: true },
        { id: 'inv4-2', text: "تم اعتماد الهدر من مدير الفرع", type: 'bool', max: 0, active: true },
        { id: 'inv4-3', text: "توجد أصناف تالفة غير مسجلة", type: 'bool', max: 0, active: true },
        { id: 'inv4-4', text: "لا يوجد هدر", type: 'bool', max: 0, active: true },
      ] },
    { id: 'inv5', name: "المنتجات الجاهزة ونصف المصنعة", order: 5, active: true,
      items: [
        { id: 'inv5-1', text: "المنتجات الجاهزة المتبقية", type: 'text', max: 0, active: true },
        { id: 'inv5-2', text: "المنتجات نصف المصنعة", type: 'text', max: 0, active: true },
        { id: 'inv5-3', text: "هل توجد منتجات غير صالحة للاستخدام؟", type: 'bool', max: 0, active: true },
        { id: 'inv5-4', text: "الأسباب", type: 'text', max: 0, active: true },
      ] },
    { id: 'inv6', name: "مطابقة المخزون", order: 6, active: true,
      rows: true, cols: ["الصنف", "الفرق", "السبب", "الإجراء"],
      items: [
        { id: 'inv6-1', text: "تمت مطابقة الفواتير والتوريدات مع الكميات المستلمة", type: 'bool', max: 0, active: true },
        { id: 'inv6-2', text: "تمت مطابقة الصرف والتشغيل مع المبيعات", type: 'bool', max: 0, active: true },
        { id: 'inv6-3', text: "تم حصر التالف والهدر", type: 'bool', max: 0, active: true },
      ] },
    { id: 'inv7', name: "قائمة إغلاق اليوم", order: 7, active: true,
      items: [
        { id: 'inv7-1', text: "المطبخ نظيف", type: 'bool', max: 0, active: true },
        { id: 'inv7-2', text: "الأبواب والثلاجات مغلقة", type: 'bool', max: 0, active: true },
        { id: 'inv7-3', text: "مناطق التخزين مرتبة", type: 'bool', max: 0, active: true },
        { id: 'inv7-4', text: "النقدية مطابقة", type: 'bool', max: 0, active: true },
        { id: 'inv7-5', text: "المواد محفوظة بطريقة صحيحة", type: 'bool', max: 0, active: true },
        { id: 'inv7-6', text: "الجرد مكتمل", type: 'bool', max: 0, active: true },
        { id: 'inv7-7', text: "الأجهزة تعمل بشكل سليم", type: 'bool', max: 0, active: true },
        { id: 'inv7-8', text: "الهدر موثق", type: 'bool', max: 0, active: true },
        { id: 'inv7-9', text: "الغاز/مصادر الطاقة مؤمنة", type: 'bool', max: 0, active: true },
        { id: 'inv7-10', text: "لا توجد ملاحظات حرجة", type: 'bool', max: 0, active: true },
      ] },
    { id: 'inv8', name: "الإجراءات التصحيحية", order: 8, active: true,
      rows: true, cols: ["الملاحظة", "المسؤول", "الإجراء التصحيحي", "موعد التنفيذ", "الحالة"],
      items: [
      ] },
  ];

  window.SNAM = { DB_KEY, SEED: seed, SECTIONS, BM_SECTIONS, INV_SECTIONS, TOTAL_POINTS, ROLES };
})();
