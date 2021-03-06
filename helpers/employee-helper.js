const { ddbClient } = require('./ddbClient');
const { ScanCommand, PutItemCommand, QueryCommand, GetItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
class EmployeeService {

    constructor() {
        this.TABLENAME = "EmployeesData"
    }

   async getAllEmployees() {
        let params = {
            TableName: this.TABLENAME,
            //Select: 'ALL_ATTRIBUTES', //https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/scancommandinput.html#select
            // FilterExpression: 'Department = :dept',
            // ExpressionAttributeValues: {
            // ':dept' : {S: 'IT'}
            // },
            // ProjectionExpression: '#Ename, Age, Designation, Department, #Loc',
            // ExpressionAttributeNames: {
            // "#Ename":"Name",
            // "#Loc":"Location"
            // }
        }
        //return ddbClient.send(new ScanCommand(params));
        console.log("params:"+JSON.stringify(params))
        let result = await ddbClient.send(new ScanCommand(params))
            .catch(err => {
                console.log("Cust err:" + err);
                return Promise.reject(err);
            });
        let employees = [];
        result.Items.forEach((item) => employees.push(unmarshall(item)));
        return Promise.resolve(employees)
    }

    addEmployee(employee) {
        let params = {
            TableName: this.TABLENAME,
            Item: marshall(employee)
            // Item: {
            //     LocationID: { S: employee.LocationID },//PK
            //     EmpCode: { S: employee.EmpCode }, //SK
            //     Name: { S: employee.Name },
            //     Age: { N: employee.Age },
            //     Location: { S: employee.Location },
            //     Designation: { S: employee.Designation },
            //     Department: { S: employee.Department }
            // }
        }
        return ddbClient.send(new PutItemCommand(params));
    }

    getEmployeesByLocation(locationId) {
        var params = {
            TableName: this.TABLENAME,
            KeyConditionExpression: "LocationId = :locId",
            ExpressionAttributeValues: {
                ":locId": { 'S': locationId }
            }
        };
        console.log("params:"+JSON.stringify(params));
        return ddbClient.send(new QueryCommand(params));
    }

    async getEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationId": { "S": locationId },
                "EmployeeId": { "S": empCode }
            }
        };
        //return ddbClient.send(new GetItemCommand(params));
        let result = await ddbClient.send(new GetItemCommand(params))
            .catch(err => Promise.reject(err)); 
            return Promise.resolve(result.Item ? unmarshall(result.Item) : undefined)

    }

    deleteEmployee(locationId, empCode) {
        var params = {
            TableName: this.TABLENAME,
            Key: {
                "LocationId": { "S": locationId },
                "EmployeeId": { "S": empCode }
            }
        };
        return ddbClient.send(new DeleteItemCommand(params));
    }
}

module.exports = { EmployeeService }
