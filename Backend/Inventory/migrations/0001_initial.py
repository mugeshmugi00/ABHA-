# Generated by Django 5.1.4 on 2025-01-27 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GRN_Product_Item_Detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Not_In_PO_Product', models.BooleanField(default=False)),
                ('Is_Foc_Product', models.BooleanField(default=False)),
                ('Tax_Type', models.CharField(max_length=30)),
                ('Purchase_rate_taxable', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Tax_Percentage', models.CharField(max_length=30)),
                ('Purchase_rate_with_tax', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Purchase_MRP', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Received_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('FOC_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Extra_PO_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Total_Received_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Total_Pack_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Is_MRP_as_sellable_price', models.BooleanField(default=True)),
                ('Sellable_price', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Sellable_qty_price', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Total_Pack_Taxable_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Total_Pack_Tax_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Total_Pack_Amount_with_tax', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Batch_No', models.CharField(max_length=30)),
                ('Is_Manufacture_Date_Available', models.BooleanField(default=True)),
                ('Manufacture_Date', models.DateField(blank=True, default=None, null=True)),
                ('Is_Expiry_Date_Available', models.BooleanField(default=True)),
                ('Expiry_Date', models.DateField(blank=True, default=None, null=True)),
                ('Discount_Method', models.CharField(max_length=30)),
                ('Discount_Type', models.CharField(max_length=30)),
                ('Discount_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Total_Pack_Taxable_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Total_Pack_Tax_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Total_Pack_Amount_with_tax', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Status', models.CharField(default='Recieved', max_length=30)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Approved_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'GRN_Product_Item_Detials',
            },
        ),
        migrations.CreateModel(
            name='GRN_Table_Detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('IsQuickGRN', models.BooleanField(default=False)),
                ('IsOldGRN', models.BooleanField(default=False)),
                ('OldGRN_Updated', models.BooleanField(default=False)),
                ('GrnDate', models.DateField()),
                ('Supplier_Bill_Number', models.CharField(max_length=50)),
                ('Supplier_Bill_Date', models.DateField()),
                ('Supplier_Bill_Due_Date', models.DateField()),
                ('Supplier_Bill_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Received_person', models.CharField(max_length=30)),
                ('Is_Foc_Available', models.BooleanField(default=False)),
                ('Foc_Method', models.CharField(max_length=30)),
                ('File_Attachment', models.BinaryField(blank=True, default=None, null=True)),
                ('Taxable_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Tax_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Total_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Total_Discount_Method', models.CharField(max_length=30)),
                ('Total_Discount_Type', models.CharField(max_length=30)),
                ('Discount_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Taxable_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Tax_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Final_Total_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Round_off_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Net_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Status', models.CharField(default='Recieved', max_length=30)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Approved_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'GRN_Table_Detials',
            },
        ),
        migrations.CreateModel(
            name='Indent_issue_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Indent_Type', models.CharField(default='issue', max_length=30)),
                ('Issue_From_NurseStation_Store', models.BooleanField(default=False)),
                ('Issue_To_NurseStation_Store', models.BooleanField(default=False)),
                ('Issue_Date', models.DateTimeField(blank=True, default=None, null=True)),
                ('Issue_ApprovedDate', models.DateTimeField(blank=True, default=None, null=True)),
                ('Issue_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Issue_Updated_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Issue_Approved_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Issue_Reason', models.TextField(default='')),
                ('Issue_Status', models.CharField(default='Issued', max_length=30)),
                ('Receive_Status', models.CharField(default='Waiting', max_length=30)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Indent_issue_items_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Issue_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Issue_Status', models.CharField(default='Issued', max_length=30)),
                ('Receive_Status', models.CharField(default='Waiting', max_length=30)),
                ('Reason', models.TextField(default='')),
                ('Remarks', models.TextField(default='')),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Indent_raise_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Raise_From_NurseStation_Store', models.BooleanField(default=False)),
                ('Raise_To_NurseStation_Store', models.BooleanField(default=False)),
                ('Raise_Date', models.DateTimeField(blank=True, default=None, null=True)),
                ('Raise_ApprovedDate', models.DateTimeField(blank=True, default=None, null=True)),
                ('Raise_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Raise_Updated_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Raise_Approved_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Raise_Reason', models.TextField(default='')),
                ('Raise_Status', models.CharField(default='Raised', max_length=30)),
                ('Issue_Status', models.CharField(default='Waiting', max_length=30)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Indent_raise_items_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Raise_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Issue_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Pending_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Raise_Status', models.CharField(default='Raised', max_length=30)),
                ('Issue_Status', models.CharField(default='Waiting', max_length=30)),
                ('Reason', models.TextField(default='')),
                ('Remarks', models.TextField(default='')),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Indent_receive_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Receive_Date', models.DateTimeField(blank=True, default=None, null=True)),
                ('Receive_ApprovedDate', models.DateTimeField(blank=True, default=None, null=True)),
                ('Receive_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Receive_Updated_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Receive_Approved_by', models.CharField(blank=True, default=None, max_length=100, null=True)),
                ('Receive_Reason', models.TextField(default='')),
                ('Receive_Status', models.CharField(default='Received', max_length=30)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Indent_receive_items_details_table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Received_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Damaged_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Pending_Quantity', models.BigIntegerField(blank=True, default=None, null=True)),
                ('Status', models.CharField(default='Received', max_length=30)),
                ('Reason', models.TextField(default='')),
                ('Remarks', models.TextField(default='')),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Location_Items_Minimum_Maximum_Detailes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('MinimumQty', models.IntegerField(blank=True, default=None, null=True)),
                ('MaximumQty', models.IntegerField(blank=True, default=None, null=True)),
                ('ReorderLevel', models.IntegerField(blank=True, default=None, null=True)),
                ('IsNurseStation', models.BooleanField(default=False)),
                ('Status', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Old_Grn_stock_detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('IsNurseStation', models.BooleanField(default=False)),
                ('TotalPackQuantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product_Category_Product_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ProductCategory_Name', models.TextField()),
                ('Status', models.BooleanField(default=True)),
                ('LedgerName', models.CharField(max_length=200, unique=True)),
                ('OpeningBalance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('DebitOrCredit', models.CharField(max_length=15)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Updated_by', models.CharField(max_length=70)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Product_Category_Product_Details',
            },
        ),
        migrations.CreateModel(
            name='Product_field_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_Name', models.TextField()),
                ('field_Order', models.IntegerField()),
                ('Status', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'Product_field_Details',
            },
        ),
        migrations.CreateModel(
            name='Product_Master_All_Category_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ItemName', models.TextField()),
                ('HSNCode', models.CharField(max_length=25)),
                ('Strength', models.IntegerField(blank=True, default=None, null=True)),
                ('StrengthType', models.CharField(max_length=25)),
                ('Volume', models.IntegerField(blank=True, default=None, null=True)),
                ('PackQty', models.IntegerField(blank=True, default=1, null=True)),
                ('MinimumQty', models.IntegerField(blank=True, default=None, null=True)),
                ('MaximumQty', models.IntegerField(blank=True, default=None, null=True)),
                ('ReorderLevel', models.IntegerField(blank=True, default=None, null=True)),
                ('IsReUsable', models.BooleanField(default=False)),
                ('ReUsableTimes', models.IntegerField(blank=True, default=None, null=True)),
                ('IsSellable', models.BooleanField(default=False)),
                ('LeastSellableUnit', models.IntegerField(blank=True, default=1, null=True)),
                ('IsPartialUse', models.BooleanField(default=False)),
                ('IsPerishable', models.BooleanField(default=False)),
                ('PerishableDuration', models.IntegerField(blank=True, default=None, null=True)),
                ('PerishableDurationType', models.CharField(max_length=30)),
                ('Is_Manufacture_Date_Available', models.BooleanField(default=False)),
                ('Is_Expiry_Date_Available', models.BooleanField(default=False)),
                ('Is_Serial_No_Available_for_each_quantity', models.BooleanField(default=False)),
                ('ProductDescription', models.TextField()),
                ('Status', models.BooleanField(default=True)),
                ('created_by', models.CharField(max_length=70)),
                ('Updated_by', models.CharField(max_length=70)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Product_Master_All_Category_Details',
            },
        ),
        migrations.CreateModel(
            name='ProductMaster_Drug_Segment_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Segment', models.TextField()),
                ('Description', models.TextField()),
                ('Status', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=70)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'ProductMaster_Drug_Segment_Details',
            },
        ),
        migrations.CreateModel(
            name='Purchase_Order_Details',
            fields=[
                ('PurchaseOrder_Number', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('Order_Date', models.DateField()),
                ('Delivery_Expected_Date', models.DateField()),
                ('Total_Order_Value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('PO_Status', models.CharField(default='Waiting For Approve', max_length=30)),
                ('Create_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Purchase_Order_Details',
            },
        ),
        migrations.CreateModel(
            name='Purchase_Order_Item_Details',
            fields=[
                ('PO_Item_Number', models.AutoField(primary_key=True, serialize=False)),
                ('PO_Order_Qty', models.CharField(max_length=20)),
                ('TotalAmount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('Received_Qty', models.IntegerField(default=0)),
                ('Balance_Qty', models.IntegerField(default=0)),
                ('Item_Status', models.CharField(default='Waiting For Approve', max_length=20)),
                ('Reason', models.TextField()),
                ('Create_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Purchase_Order_Item_Details',
            },
        ),
        migrations.CreateModel(
            name='Purchase_Return_Details_Table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Purchase_Return_Date', models.DateField()),
                ('Return_Total_Item', models.BigIntegerField()),
                ('Return_Total_Quantity', models.BigIntegerField()),
                ('Return_Total_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Status', models.CharField(default='Pending', max_length=30)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Purchase_Return_Items_Details_Table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Reason', models.CharField(max_length=40)),
                ('Single_Product_Purchase_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Available_Pack_Quantity', models.BigIntegerField()),
                ('Return_Quantity', models.BigIntegerField()),
                ('Return_Pack_Quantity', models.BigIntegerField()),
                ('Return_Quantity_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Remarks', models.TextField()),
                ('Status', models.CharField(default='Pending', max_length=30)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='SerialNumber_Stock_Maintance_Table_Detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Serial_Number', models.CharField(max_length=30, unique=True)),
                ('IsNurseStation', models.BooleanField(default=False)),
                ('Item_Status', models.CharField(max_length=50)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Stock_Maintance_Table_Detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Batch_No', models.CharField(blank=True, default=None, max_length=25, null=True)),
                ('Is_MRP_as_sellable_price', models.BooleanField(default=True)),
                ('Sellable_price', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Sellable_qty_price', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Is_Manufacture_Date_Available', models.BooleanField(default=True)),
                ('Manufacture_Date', models.DateField(blank=True, default=None, null=True)),
                ('Is_Expiry_Date_Available', models.BooleanField(default=True)),
                ('Expiry_Date', models.DateField(blank=True, default=None, null=True)),
                ('Total_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Total_Moved_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Grn_Recieve_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Indent_Send_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Indent_Recieve_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Indent_Return_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Grn_Return_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Scrab_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('Sold_Quantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('AvailableQuantity', models.BigIntegerField(blank=True, default=0, null=True)),
                ('IsNurseStation', models.BooleanField(default=False)),
                ('Expiry_Status', models.CharField(default='Not-Expired', max_length=50)),
                ('Is_Serial_No_Available_for_each_quantity', models.BooleanField(default=False)),
                ('Is_Serial_No_Status', models.CharField(default='Not_Applicable', max_length=30)),
                ('Serial_No_Type', models.CharField(blank=True, default=None, max_length=50, null=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Updated_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='SubCategory_Detailes',
            fields=[
                ('SubCategory_Id', models.AutoField(primary_key=True, serialize=False)),
                ('SubCategoryName', models.CharField(max_length=150)),
                ('Status', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'SubCategory_Detailes',
            },
        ),
        migrations.CreateModel(
            name='Supplier_Bank_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Bank_Name', models.CharField(max_length=100)),
                ('Account_Number', models.CharField(max_length=50)),
                ('IFSCCode', models.CharField(max_length=30)),
                ('BankBranch', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Supplier_Bank_Details',
            },
        ),
        migrations.CreateModel(
            name='Supplier_Master_Details',
            fields=[
                ('Supplier_Id', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('Supplier_Name', models.CharField(max_length=255)),
                ('Supplier_Type', models.CharField(max_length=50)),
                ('Contact_Person', models.CharField(max_length=200)),
                ('Contact_Number', models.CharField(max_length=10)),
                ('Email_Address', models.CharField(max_length=100)),
                ('Address', models.TextField()),
                ('Registration_Number', models.CharField(max_length=30)),
                ('GST_Number', models.CharField(max_length=20)),
                ('PAN_Number', models.CharField(max_length=20)),
                ('Druglicense_Number', models.TextField(blank=True, null=True)),
                ('Payment_Terms', models.IntegerField()),
                ('Credit_Limit', models.IntegerField()),
                ('DeliveryDuration', models.IntegerField()),
                ('Status', models.BooleanField(default=True)),
                ('Notes', models.TextField()),
                ('File_Attachment', models.BinaryField(blank=True, default=None, null=True)),
                ('created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Supplier_Master_Details',
            },
        ),
        migrations.CreateModel(
            name='Supplier_Pay_By_Date',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('GRN_Invoice_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('GRN_Paid_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('GRN_Balance_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Paid_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Balance_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Bill_Paid_Date', models.DateField()),
                ('Payment_Method', models.CharField(max_length=50)),
                ('Payment_Detials', models.TextField()),
                ('NewPayment', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Supplier_pay_detials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('GRN_Invoice_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('GRN_Paid_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('GRN_Balance_Amount', models.DecimalField(decimal_places=3, default=0, max_digits=10)),
                ('Status', models.BooleanField(default=False)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Supplier_Product_Amount_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PurchaseRateBeforeGST', models.DecimalField(decimal_places=2, max_digits=10)),
                ('GST', models.CharField(max_length=10)),
                ('PurchaseRateAfterGST', models.DecimalField(decimal_places=2, max_digits=10)),
                ('MRP', models.DecimalField(decimal_places=2, max_digits=10)),
                ('EditType', models.CharField(max_length=25)),
                ('created_by', models.CharField(max_length=15)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Supplier_Product_Amount_Details',
            },
        ),
        migrations.CreateModel(
            name='Supplier_Product_Details',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Status', models.BooleanField(default=True)),
                ('created_by', models.CharField(max_length=15)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Update_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'Supplier_Product_Details',
            },
        ),
        migrations.CreateModel(
            name='UnitOfMeasurement',
            fields=[
                ('Unit_Id', models.AutoField(primary_key=True, serialize=False)),
                ('Unit_Name', models.CharField(max_length=70)),
                ('Unit_Symbol', models.CharField(max_length=10)),
                ('Unit_Type', models.CharField(max_length=50)),
                ('Base_Unit', models.CharField(max_length=50)),
                ('Conversion_Factor', models.DecimalField(decimal_places=6, max_digits=10)),
                ('Difference_Description', models.TextField()),
                ('Status', models.BooleanField(default=True)),
                ('Created_by', models.CharField(max_length=100)),
                ('Created_at', models.DateTimeField(auto_now_add=True)),
                ('Updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'UnitOfMeasurement',
            },
        ),
    ]
