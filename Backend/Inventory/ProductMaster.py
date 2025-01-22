import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import  Q
from .models import (
    UnitOfMeasurement,
    SubCategory_Detailes,
    Product_Master_All_Category_Details,
    ProductMaster_Drug_Segment_Details,
    Product_Category_Product_Details
    
)
from Masters.models import(
    Product_Group_Master_Details,
    Pack_Type_Master_Details,
    ProductType_Master_Details,
    GenericName_Master_Details,
    CompanyName_mfg_Master_Details
    
   
)
from django.db.models import Func



@csrf_exempt
@require_http_methods(["POST", "OPTIONS","GET"])
def product_master_Detials_link(request):
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            Item_Code = data.get("Item_Code")
            Item_Name = data.get("Item_Name")
            normalized_name = Item_Name.replace(" ", "").lower()
            Product_Category = data.get("Product_Category")
            Sub_Category = data.get("Sub_Category")
            Generic_Name = data.get("Generic_Name")
            Manufacturer_Name = data.get("Manufacturer_Name")
            HSN_Code = data.get("HSN_Code")
            Product_Type = data.get("Product_Type")
            Product_Group = data.get("Product_Group")
            Strength = data.get("Strength")
            Strength_Type = data.get("Strength_Type")
            Volume = data.get("Volume")
            Volume_Type = data.get("Volume_Type")
            Pack_Type = data.get("Pack_Type")
            Pack_Quantity = data.get("Pack_Quantity")
            Minimum_Quantity = data.get("Minimum_Quantity")
            Maximum_Quantity = data.get("Maximum_Quantity")
            Re_order_Level = data.get("Re_order_Level")
            Is_Reusable = data.get("Is_Reusable")=='Yes'
            Re_Usable_Times = data.get("Re_Usable_Times")
            Is_Sellable = data.get("Is_Sellable")=='Yes'
            Least_Sellable_Unit = data.get("Least_Sellable_Unit")
            Is_Partial_Use = data.get("Is_Partial_Use")=='Yes'
            Is_Perishable = data.get("Is_Perishable")=='Yes'
            Perishable_Duration = data.get("Perishable_Duration")
            Perishable_Duration_Type = data.get("Perishable_Duration_Type")
            Is_Manufacture_Date_Available = data.get("Is_Manufacture_Date_Available") =='Yes'
            Is_Expiry_Date_Available = data.get("Is_Expiry_Date_Available")=='Yes'
            Is_Serial_No_Available_for_each_quantity = data.get("Is_Serial_No_Available_for_each_quantity")=='Yes'
            Drug_Segment = data.get("Drug_Segment")
            Product_Description = data.get("Product_Description")
            Created_by = data.get("Created_by")
            
            
            Product_Category_instance = None
            Sub_Category_instance = None
            Generic_instance = None
            Manufacturer_instance = None
            Product_Type_instance = None
            Product_Group_instance = None
            Volume_Type_instance = None
            Pack_Type_instance = None
            
            
            if Product_Category:
                Product_Category_instance =Product_Category_Product_Details.objects.get(pk = int(Product_Category))
            
            if Sub_Category:
                Sub_Category_instance =SubCategory_Detailes.objects.get(pk = int(Sub_Category))
            
            if Generic_Name:
                Generic_instance =GenericName_Master_Details.objects.get(pk = int(Generic_Name))
            
            if Manufacturer_Name:
                Manufacturer_instance =CompanyName_mfg_Master_Details.objects.get(pk = int(Manufacturer_Name))
            
            if Product_Type:
                Product_Type_instance =ProductType_Master_Details.objects.get(pk = int(Product_Type))
            
            if Product_Group:
                Product_Group_instance =Product_Group_Master_Details.objects.get(pk = int(Product_Group))
            
            if Volume_Type:
                Volume_Type_instance =UnitOfMeasurement.objects.get(pk = int(Volume_Type))
            
            if Pack_Type:
                Pack_Type_instance =Pack_Type_Master_Details.objects.get(pk = int(Pack_Type))
            
            
            if Item_Code:
                existing_Product = Product_Master_All_Category_Details.objects.annotate(
                        normalized_name=Func(
                            'ItemName',
                            function='LOWER',
                            template="REPLACE(%(expressions)s, ' ', '')"
                        )
                    ).filter(normalized_name=normalized_name).exclude(pk=Item_Code)
                
                if existing_Product.exists():
                    return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})
                
                Product_instance = Product_Master_All_Category_Details.objects.get(pk = Item_Code)
                
                Product_instance.ItemName =Item_Name
                Product_instance.ProductCategory =Product_Category_instance
                Product_instance.SubCategory =Sub_Category_instance
                Product_instance.GenericName =Generic_instance
                Product_instance.CompanyName =Manufacturer_instance
                Product_instance.HSNCode =HSN_Code
                Product_instance.ProductType =Product_Type_instance
                Product_instance.ProductGroup =Product_Group_instance
                Product_instance.Strength =Strength
                Product_instance.StrengthType =Strength_Type
                Product_instance.Volume =Volume
                Product_instance.VolumeType =Volume_Type_instance
                Product_instance.PackType =Pack_Type_instance
                Product_instance.PackQty =Pack_Quantity
                Product_instance.MinimumQty =Minimum_Quantity
                Product_instance.MaximumQty =Maximum_Quantity
                Product_instance.ReorderLevel =Re_order_Level
                Product_instance.IsReUsable =Is_Reusable
                Product_instance.ReUsableTimes =Re_Usable_Times
                Product_instance.IsSellable =Is_Sellable
                Product_instance.LeastSellableUnit =Least_Sellable_Unit
                Product_instance.IsPartialUse =Is_Partial_Use
                Product_instance.IsPerishable =Is_Perishable
                Product_instance.PerishableDuration =Perishable_Duration
                Product_instance.PerishableDurationType =Perishable_Duration_Type
                Product_instance.Is_Manufacture_Date_Available =Is_Manufacture_Date_Available
                Product_instance.Is_Expiry_Date_Available =Is_Expiry_Date_Available
                Product_instance.Is_Serial_No_Available_for_each_quantity =Is_Serial_No_Available_for_each_quantity
                Product_instance.ProductDescription =Product_Description
                Product_instance.Updated_by =Created_by
                
                Product_instance.save()
                if Drug_Segment:
                
                    Drug_Segment_list = Drug_Segment.split(',')
                    convertedfields = [int(f) for f in Drug_Segment_list]
                    field_instances = ProductMaster_Drug_Segment_Details.objects.filter(pk__in = convertedfields)
                    Product_instance.DrugSegment.set(field_instances)

                return JsonResponse({'success': 'Item Updated successfully'})
                
            else:
                existing_Product = Product_Master_All_Category_Details.objects.annotate(
                        normalized_name=Func(
                            'ItemName',
                            function='LOWER',
                            template="REPLACE(%(expressions)s, ' ', '')"
                        )
                    ).filter(normalized_name=normalized_name)
                
                if existing_Product.exists():
                    return JsonResponse({'warn': f"A Item Name '{Item_Name}' already exists in the {Product_Category_instance.ProductCategory_Name} Category"})
                
                Product_instance = Product_Master_All_Category_Details(
                    ItemName = Item_Name,
                    ProductCategory = Product_Category_instance,
                    SubCategory = Sub_Category_instance,
                    GenericName = Generic_instance,
                    CompanyName = Manufacturer_instance,
                    HSNCode = HSN_Code,
                    ProductType = Product_Type_instance,
                    ProductGroup = Product_Group_instance,
                    Strength = Strength,
                    StrengthType = Strength_Type,
                    Volume = Volume,
                    VolumeType =Volume_Type_instance,
                    PackType =Pack_Type_instance,
                    PackQty =Pack_Quantity,
                    MinimumQty = Minimum_Quantity,
                    MaximumQty = Maximum_Quantity,
                    ReorderLevel = Re_order_Level,
                    IsReUsable = Is_Reusable,
                    ReUsableTimes = Re_Usable_Times,
                    IsSellable = Is_Sellable,
                    LeastSellableUnit = Least_Sellable_Unit,
                    IsPartialUse = Is_Partial_Use,
                    IsPerishable = Is_Perishable,
                    PerishableDuration = Perishable_Duration,
                    PerishableDurationType = Perishable_Duration_Type,
                    Is_Manufacture_Date_Available =Is_Manufacture_Date_Available,
                    Is_Expiry_Date_Available =Is_Expiry_Date_Available,
                    Is_Serial_No_Available_for_each_quantity =Is_Serial_No_Available_for_each_quantity,
                    ProductDescription = Product_Description,
                    Created_at = Created_by,
                    )
                Product_instance.save()
                
                if Drug_Segment:
                
                    Drug_Segment_list = Drug_Segment.split(',')
                    convertedfields = [int(f) for f in Drug_Segment_list]
                    field_instances = ProductMaster_Drug_Segment_Details.objects.filter(pk__in = convertedfields)
                    Product_instance.DrugSegment.set(field_instances)

                return JsonResponse({'success': 'Item added successfully'})
                
            

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON input'}, status=400)

        except Exception as e:
            return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)
    elif request.method == 'GET':
        try:
            ProductCategory = request.GET.get('ProductCategory')
            SubCategory = request.GET.get('SubCategory','')
            ItemCode = request.GET.get('ItemCode','')
            ItemName = request.GET.get('ItemName','')
            GenericName = request.GET.get('GenericName','')
            CompanyName = request.GET.get('CompanyName','')
            HSNCode = request.GET.get('HSNCode','')
            Singledata = bool(request.GET.get('Singledata',False))
            ForFilter = bool(request.GET.get('ForFilter',False))
            filter_conditions = Q()
            
            if ProductCategory:
                filter_conditions &= Q(ProductCategory__pk =ProductCategory)
            if SubCategory:
                filter_conditions &= Q(SubCategory__pk =SubCategory)
            if ItemCode:
                filter_conditions &= Q(pk__icontains=ItemCode)
            if ItemName:
                filter_conditions &= Q(ItemName__icontains=ItemName)
            if GenericName:
                filter_conditions &= Q(GenericName__pk=GenericName)
            if CompanyName:
                filter_conditions &= Q(CompanyName__pk=CompanyName)
            if HSNCode:
                filter_conditions &= Q(HSNCode__icontains=HSNCode)

            
            if ForFilter :
                pass
            elif ItemCode and Singledata:
                pass
           
            else:
                Product_Instance = Product_Master_All_Category_Details.objects.filter(filter_conditions)
                product_instance_data =[]
                index =1
                for ins in Product_Instance:
                    Drug_Segment_pks = list(ins.DrugSegment.values_list('pk', flat=True)) if ins.DrugSegment else None
                    ins_data={
                        "id":index,
                        "Item_Code":ins.pk,
                        "Item_Name":ins.ItemName,
                        "Product_Category_pk":ins.ProductCategory.pk if ins.ProductCategory else '',
                        "Product_Category":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
                        "Sub_Category_pk":ins.SubCategory.pk if ins.SubCategory else '',
                        "Sub_Category":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
                        "Generic_Name_pk":ins.GenericName.pk if ins.GenericName else '',
                        "Generic_Name":ins.GenericName.GenericName if ins.GenericName else '',
                        "Manufacturer_pk":ins.CompanyName.pk if ins.CompanyName else '',
                        "Manufacturer_Name":ins.CompanyName.CompanyName if ins.CompanyName else '',
                        "HSN_Code":ins.HSNCode,
                        "Product_Type_pk":ins.ProductType.pk if ins.ProductType else '',
                        "Product_Type":ins.ProductType.ProductType_Name if ins.ProductType else '',
                        "Product_Group_pk":ins.ProductGroup.pk if ins.ProductGroup else '',
                        "Product_Group":ins.ProductGroup.ProductGroup_Name if ins.ProductGroup else '',
                        "Strength":ins.Strength,
                        "Strength_Type":ins.StrengthType,
                        "Volume":ins.Volume,
                        "Volume_Type_pk":ins.VolumeType.pk if ins.VolumeType else '',
                        "Volume_Type":f"{ins.VolumeType.Unit_Name} ({ins.VolumeType.Unit_Symbol})" if ins.VolumeType else '',
                        "Pack_Type_pk":ins.PackType.pk if ins.PackType else '',
                        "Pack_Type":ins.PackType.PackType_Name if ins.PackType else '',
                        "Pack_Quantity":ins.PackQty,
                        "Minimum_Quantity":ins.MinimumQty,
                        "Maximum_Quantity":ins.MaximumQty,
                        "Re_order_Level":ins.ReorderLevel,
                        "Is_Reusable":'Yes' if ins.IsReUsable else "No",
                        "Re_Usable_Times":ins.ReUsableTimes,
                        "Is_Sellable":'Yes' if ins.IsSellable else "No",
                        "Least_Sellable_Unit":ins.LeastSellableUnit,
                        "Is_Partial_Use":'Yes' if ins.IsPartialUse else "No",
                        "Is_Perishable":'Yes' if ins.IsPerishable else "No",
                        "Perishable_Duration":ins.PerishableDuration,
                        "Perishable_Duration_Type":ins.PerishableDurationType,
                        "Is_Manufacture_Date_Available":'Yes' if ins.Is_Manufacture_Date_Available else "No",
                        "Is_Expiry_Date_Available":'Yes' if ins.Is_Expiry_Date_Available else "No",
                        "Is_Serial_No_Available_for_each_quantity":'Yes' if ins.Is_Serial_No_Available_for_each_quantity else "No",
                        "Drug_Segment":Drug_Segment_pks,
                        "Product_Description":ins.ProductDescription,
                        "Status": "Active" if ins.Status else "Inactive"
                    }
                    product_instance_data.append(ins_data)
                    index += 1
                return JsonResponse(product_instance_data, safe=False)
                
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'}, status=500)





@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def Update_product_master_status(request):
   
    
    try:
        data = json.loads(request.body)
        ItemCode = data.get('ItemCode')

        if not ItemCode:
            return JsonResponse({'error': 'ItemCode is required'}, status=400)

       
        try:
            product_instance = Product_Master_All_Category_Details.objects.get(pk = ItemCode)
            product_instance.Status = not product_instance.Status  # Toggle the status
            product_instance.save()

            return JsonResponse({'success': 'Product status updated successfully.'}, status=200)

        except Product_Master_All_Category_Details.DoesNotExist:
            return JsonResponse({'error': 'Product with given Item Code not found.'}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON input'}, status=400)

    except Exception as e:
        return JsonResponse({'error': f'An internal server error occurred: {str(e)}'}, status=500)




# ----------------------------------New get----------------------------------------


@csrf_exempt
@require_http_methods(["GET"])
def GET_Product_Detials_For_Tray_link(request):
    if request.method == 'GET':
        try:

            Product_Instance = Product_Master_All_Category_Details.objects.all()
            
            product_instance_data =[]

            for ins in Product_Instance:
                    ins_data={
                        "Item_Code":ins.pk,
                        "Item_Name":ins.ItemName,
                        "Product_Category":ins.ProductCategory.ProductCategory_Name if ins.ProductCategory else '',
                        "Sub_Category":ins.SubCategory.SubCategoryName if ins.SubCategory else '',
                    }
                    product_instance_data.append(ins_data)
    

            print('product_instance_data',product_instance_data)
            return JsonResponse(product_instance_data, safe=False)
           
            
                
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return JsonResponse({'error': 'An internal server error occurred'},status=500)


