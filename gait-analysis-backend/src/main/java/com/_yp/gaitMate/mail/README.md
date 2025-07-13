- Added new properties in application.yml


- Added new fields to entities(clinic/patient/doctor) - invitationToken, accountStatus
- Removed the nullable=false constraint on the user attribute to make it possible to create entities without attached users

- TODO: The data.sql should be updated
- Removed the username and password fields from the DTOs related to creating clinic, doctor and patient
- Updated the create methods in the service classes of clinic, doctor and patient

Removed the nullable=false constraint for the user field in the entities. 
Modified the sendInvitationEmail method's arguments to centralize the url creation.
