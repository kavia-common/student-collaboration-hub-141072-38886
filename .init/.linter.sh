#!/bin/bash
cd /home/kavia/workspace/code-generation/student-collaboration-hub-141072-38886/student_admin_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

