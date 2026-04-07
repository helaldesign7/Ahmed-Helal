من اللي بعته، السبب واضح جدًا:

في الـ Network، طلب القراءة من site_settings ناجح، لكن طلب الحفظ إلى site_settings بيرجع 401. ده معناه إن القراءة مفتوحة، لكن الكتابة على site_settings مرفوضة.
وفي نفس الوقت، AdminContext الحالي ما زال يعمل حفظ فوري على كل تعديل عبر syncSettings(...) داخل updateText(...)، ويكتب activity_logs حتى لو الحفظ الحقيقي فشل، لذلك ظهور سجلات في activity_logs ليس دليلًا أن التعديل اتحفظ.
كمان AuthContext عندك بيرجع حالة المستخدم من localStorage (portfolio_session) عند بداية التشغيل، لكنه لا يعيد مزامنة حالة الأدمن من جلسة Supabase عند بدء الصفحة. يعني ممكن الداشبورد يبان كأنك أدمن، بينما طلبات Supabase للكتابة تظل كأنها anon.
والموقع العام نفسه فعلاً بيعتمد على site_settings / siteContent / sections، لأن PublicHome وNavbar بيقرؤوا من useAdmin()، فطالما site_settings مش بتتحفظ، طبيعي الزائر ما يشوفش التغييرات.
الحل النهائي: 3 أشياء لازم تتصلح

1. صلاحيات site_settings في Supabase

شغّل ده في Supabase → SQL Editor:

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_select" on public.site_settings;
drop policy if exists "site_settings_auth_insert" on public.site_settings;
drop policy if exists "site_settings_auth_update" on public.site_settings;

create policy "site_settings_public_select"
on public.site_settings
for select
to public
using (id = 'global');

create policy "site_settings_auth_insert"
on public.site_settings
for insert
to authenticated
with check (id = 'global');

create policy "site_settings_auth_update"
on public.site_settings
for update
to authenticated
using (id = 'global')
with check (id = 'global');

ده يحل الـ 401 على الحفظ بشرط إن الأدمن يكون فعلاً داخل بجلسة Supabase صحيحة.

2. مزامنة جلسة الأدمن الحقيقية مع Supabase

الملف الذي يجب تعديله:

src/contexts/AuthContext.tsx
المشكلة فيه

هو حاليًا يبدأ من portfolio_session فقط، ويعمل signInWithPassword وقت login، لكن لا يعمل rehydrate/session check من Supabase عند بدء الصفحة.

المطلوب

لازم تضيف:

useEffect
supabase.auth.getSession()
supabase.auth.onAuthStateChange()

بحيث:

لو مفيش Supabase session حقيقية للأدمن → يتشال portfolio_session
ولو فيه session صحيحة → يتضبط user منها
تعديل منطقي مطلوب داخل AuthContext.tsx

الفكرة تكون كده:

useEffect(() => {
const adminEmail = 'helal.design7@gmail.com';

const applySession = (session: any) => {
const sbUser = session?.user;

    if (sbUser?.email?.toLowerCase() === adminEmail) {
      const adminUser = {
        id: sbUser.id,
        email: adminEmail,
        role: 'super_admin',
        name: sbUser.user_metadata?.full_name || 'Ahmed Helal'
      };
      setUser(adminUser);
      localStorage.setItem('portfolio_session', JSON.stringify(adminUser));
      return;
    }

    // لو مش أدمن Supabase حقيقي، ما تسيبش واجهة الأدمن شغالة بجلسة محلية مضللة
    if (JSON.parse(localStorage.getItem('portfolio_session') || 'null')?.role === 'super_admin') {
      setUser(null);
      localStorage.removeItem('portfolio_session');
    }

};

supabase.auth.getSession().then(({ data }) => {
applySession(data.session);
});

const { data: sub } = supabase.auth.onAuthStateChange((\_event, session) => {
applySession(session);
});

return () => {
sub.subscription.unsubscribe();
};
}, []);
وبعد التعديل

اعمل:

Logout
امسح portfolio_session من Local Storage
Login من جديد بالأدمن الحقيقي 3) AdminContext ما زال أوتوسيف، وليس Manual Save حقيقي

الملف الذي يجب تعديله:

src/contexts/AdminContext.tsx
المشكلة الحالية

من الكود الحالي:

updateText(...) يعمل setSiteContent(...)
ثم فورًا syncSettings(...)
ثم فورًا logActivity(...)
يعني ما زال يحفظ تلقائيًا على كل حرف/تعديل، وليس بنظام draft + save button.

وده يفسر ليه:

التعديلات ترتد
الزرار يقول حفظ/فشل حفظ
وactivity_logs تمتلئ رغم أن site_settings نفسها لم تُحفظ
المطلوب هنا

لازم AdminContext.tsx يتقسم إلى:

persisted state
appearance
config
siteContent
sections
draft state
draftAppearance
draftConfig
draftSiteContent
draftSections
ودوال جديدة
updateDraftText(...)
updateDraftSectionArray(...)
saveWebsiteChanges()
resetWebsiteChanges()
hasUnsavedChanges
مهم جدًا
أوقف الأوتوسيف من هذه الدوال:
updateText
updateSectionArray
toggleVisibility
moveSection
reorderSections
setSectionsOrder

لأنها الآن ما زالت تعمل حفظًا مباشرًا.

بدلًا من ذلك

خليها:

تعدل الـ draft فقط
ولا تنادي syncSettings إطلاقًا
ثم زرار الحفظ فقط هو من ينادي:
await saveWebsiteChanges()
الملفات التي تحتاج تعديل الآن بالترتيب
ملفات أساسية ولازم تتعدل
src/contexts/AuthContext.tsx
لتثبيت جلسة الأدمن الحقيقية مع Supabase.
src/contexts/AdminContext.tsx
لأن منطق الحفظ الحالي ما زال أوتوسيف وليس draft/manual save، ولأن logActivity يحدث حتى مع فشل الحفظ.
src/contexts/useAdmin.ts
لتوسيع الـ context API وإضافة:
saveWebsiteChanges
resetWebsiteChanges
hasUnsavedChanges
draft\* states إذا لزم.
ملفات واجهة غالبًا ستحتاج تعديل
الصفحة التي فيها زر “حفظ التغييرات” للمظهر
الصفحة التي فيها تعديل المحتوى والسكاشن
الصفحة التي فيها ترتيب/إخفاء/إظهار العناصر العامة
أي editor مثل:
DictionaryEditor
Appearance settings page
Sections/content manager
ليه؟

لأن هذه الصفحات يجب أن تتوقف عن استخدام:

updateText القديمة
toggleVisibility القديمة
reorderSections القديمة

وتستخدم بدلًا منها:

draft update functions
ما الذي لا يحتاج تعديل الآن؟
CRM
leads
tasks
notes
links
workspace الداخلي

لأنك قلت بوضوح:
أنت تريد الحفظ العالمي فقط للحاجات التي يراها الزائر على الموقع.

ترتيب التنفيذ الصحيح
أولًا

شغّل SQL الخاصة بـ site_settings

ثانيًا

أصلح AuthContext.tsx

ثالثًا

في AdminContext.tsx:

أوقف الأوتوسيف
أوقف logActivity على كل حرف/تغيير
نفّذ draft state
اجعل الحفظ الحقيقي في saveWebsiteChanges()
رابعًا

اربط زر “حفظ التغييرات” بـ saveWebsiteChanges()

خامسًا

اربط زر “إلغاء” أو “Reset” بـ resetWebsiteChanges()

لماذا يظهر عندك activity_logs رغم أن الحفظ فشل؟

لأن الكود الحالي يسجل activity على أي تعديل حتى لو فشل save الحقيقي. ده واضح من updateText(...) التي تنادي syncSettings(...) ثم logActivity(...) مباشرة.

الخلاصة النهائية

المشكلة ليست في زرار الحفظ نفسه فقط.
المشكلة الحقيقية مركبة من:

RLS ناقصة على site_settings ← سبب 401
جلسة الأدمن في الواجهة ليست موثوقة دائمًا مع Supabase ← قد تبقى UI “أدمن” لكن الكتابة تخرج anon
AdminContext لم يتحول فعليًا إلى manual-save flow ← ما زال أوتوسيف ويكتب logs مضللة
