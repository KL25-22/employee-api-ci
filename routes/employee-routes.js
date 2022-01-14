const { Router } = require('express');
const { EmployeeService } = require('../helpers/employee-helper');

var router = Router();
var empSvc = new EmployeeService();
//GET http://localhost:5000/employees

//get all emp
router.get("/", async (req, res) => {
    let emps = await empSvc.getAllEmployees()
        .catch(err => res.status(500).json({ 'Message': 'Unable to read employee' }));
    if (emps) {
        res.status(200).json(emps);
    }
});

//add emp
router.post("/", async (req, res) => {
    console.log(req);
    let employee = req.body;
    console.log(employee);
    let result = await empSvc.addEmployee(employee)
    .catch(err => res.status(500).json({ 'Message': 'Unable to add employee'+err }));
if (result) {
    res.status(201).json({ 'Message': 'successfully added employee' });
}
})


//Get employees from a location
//GET /employees/location/:locId
router.get('/location/:locId', async(req,res)=>{
    let locationId = req.params["locId"];
    let result = await empSvc.getEmployeesByLocation(locationId)
    .catch(err=>{
    console.log(err);
    res.status(500).json({'message':'Error in fetching employees data'})
    })
    if(result){
    res.status(200).json(result.Items);
    }
    })

    //Get a single employee
//GET /employees/location/:locId/empcode/:ecode
router.get("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.getEmployee(locationId,empCode)
    .catch(err=>{
    console.log(err);
    res.status(500).json({ 'message': 'Unable to get employee details'})
    })
    if(result){
    res.status(200).json(result);
    }
    else{
        res.status(404).json({'Message':'Employee Not found'})
    }
    })


     //delete single employee
//GET /employees/location/:locId/empcode/:ecode
router.delete("/location/:locId/empcode/:ecode",async(req,res)=>{
    let locationId = req.params["locId"];
    let empCode = req.params["ecode"];
    let result = await empSvc.deleteEmployee(locationId,empCode)
    .catch(err=>{
    console.log(err);
    res.status(500).json({ 'message': 'Unable to delete employee details'})
    })
    if(result){
    res.status(200).json({ 'message': 'Deleted successfully'});
    }
    })
    
    

    
module.exports = { router } 