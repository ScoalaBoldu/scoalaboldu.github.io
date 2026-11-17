# Acces la site – roluri și proceduri

Site: https://scoalaboldu.github.io (în pregătire pentru domeniul scoalaboldu.ro)
Depozit: `ScoalaBoldu/scoalaboldu.github.io` · editor: https://app.pagescms.org

Parolele **nu** se scriu în acest fișier și nici în alt fișier din depozit.

## Roluri

| Rol | Cine | Acces | Cum lucrează |
| --- | --- | --- | --- |
| Proprietar | contul GitHub `ScoalaBoldu` (parola și codurile 2FA la director și la administratorul site-ului) | proprietar | nu se folosește zilnic |
| Administrator site | (de completat) | Admin pe depozit + Pages CMS | aprobă, invită, retrage accese |
| Editor 1 | (de completat) | invitat în Pages CMS (e-mail) sau colaborator GitHub „Write” | Pages CMS |
| Editor 2 | (de completat) | idem | Pages CMS |
| Editor 3 | (de completat) | idem | Pages CMS |
| Claude | aplicația GitHub „Claude”, instalată doar pe acest depozit | Write, doar pe acest depozit | migrări, corecturi, actualizări tehnice |

## Cum se dă acces unui editor

**Varianta simplă (fără cont GitHub):** administratorul intră în Pages CMS → site-ul școlii → **Settings → Collaborators** → adaugă adresa de e-mail a profesorului. Profesorul primește invitația pe e-mail și intră cu „Continue with email”.

**Varianta cu cont GitHub:** profesorul își face cont pe github.com (cu autentificare în doi pași). Proprietarul îl adaugă din depozit: **Settings → Collaborators → Add people**, rol „Write”. Profesorul acceptă invitația și intră în Pages CMS cu „Sign in with GitHub”.

## Când cineva pleacă din școală

1. Pages CMS → Settings → Collaborators → ștergeți adresa lui.
2. Dacă avea cont GitHub: depozit → Settings → Collaborators → Remove.
3. Dacă știa parola contului `ScoalaBoldu`: schimbați parola și regenerați codurile 2FA.

## Protecții

- Ramura `main` (site-ul publicat) și `hugo-sursa` (sursa) nu se șterg și nu se rescriu forțat.
- Orice modificare se poate anula din istoricul GitHub (Commits → Revert).
