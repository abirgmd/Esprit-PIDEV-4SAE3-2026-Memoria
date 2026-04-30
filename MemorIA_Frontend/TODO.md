# Frontend Errors Fix TODO

## Steps from Approved Plan:

1. **Read problematic files** 
   - src/app/signup/signup.component.ts
   - src/app/users/users.component.ts

2. **Fix fb initialization** 
   - Add `!` to `this.fb!.nonNullable.group(...)` or reorder fields to declare fb first.

3. **Fix role type comparisons** 
   - Update role FormControl type to `'PATIENT' | 'ACCOMPAGNANT' | 'SOIGNANT' | 'ADMIN'`.
   - Or use type guard `if (this.role.value === 'ACCOMPAGNANT' as any)` temporarily.

4. **Test build** 
   - cd MemorIA_Frontend && ng build
   - Fix any new errors.

5. **Run dev server** 
   - ng serve

6. **Verify in browser** 
   - Check no console errors, features work.

**Progress:** 
- [x] Plan approved by user
- [x] TODO created

Next: Read files.
