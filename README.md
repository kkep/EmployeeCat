# 1. Run Docker Engine
# 2. Clone repository
``
git clone https://github.com/kkep/EmployeeCat.git
``

``
cd EmployeeCat
``


# Run project
CREATE .env
``
cp .env.example .env
``

## local up prev
``
.\gradlew.bat bootRun
``

## dev up
``
docker-compose up --build
``

## production up
``
docker-compose -f docker-compose.prod.yml up --build
``
